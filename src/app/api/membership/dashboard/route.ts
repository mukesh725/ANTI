import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
import { verifyToken } from '@/lib/membershipAuth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { mobile: string } | null;
    
    if (!decoded || !decoded.mobile) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // 1. Get User
    const usersRef = collection(db, 'users');
    const userSnapshot = await getDocs(query(usersRef, where('mobile', '==', decoded.mobile)));
    
    if (userSnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const userDoc = userSnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as any;

    // 2. Get Membership
    const membershipsRef = collection(db, 'memberships');
    const membershipSnapshot = await getDocs(
      query(membershipsRef, where('userId', '==', user.id))
    );

    let membership = null;
    if (!membershipSnapshot.empty) {
      const memDoc = membershipSnapshot.docs[0];
      membership = { id: memDoc.id, ...memDoc.data() } as any;

      // 3. Get Plan details
      if (membership.planId) {
        const plansRef = collection(db, 'membershipPlans');
        const planSnapshot = await getDocs(query(plansRef, where('__name__', '==', membership.planId)));
        if (!planSnapshot.empty) {
          membership.plan = { id: planSnapshot.docs[0].id, ...planSnapshot.docs[0].data() };
        }
      }

      // 4. Get Transactions
      const txRef = collection(db, 'membershipTransactions');
      const txSnapshot = await getDocs(
        query(txRef, where('membershipId', '==', membership.id), orderBy('createdAt', 'desc'))
      );
      membership.transactions = txSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
        dob: user.dob,
        bloodGroup: user.bloodGroup
      },
      membership: membership || null 
    });
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
