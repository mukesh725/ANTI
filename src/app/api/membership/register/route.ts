import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { verifyToken } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { mobile: string } | null;
    
    if (!decoded || !decoded.mobile) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, gender, dob, occupation, bloodGroup, emergencyContact } = body;

    if (!firstName || !email) {
      return NextResponse.json({ error: 'First name and email are required' }, { status: 400 });
    }

    const usersRef = collection(db, 'users');

    // Check if user with this email already exists
    const emailQuerySnap = await getDocs(query(usersRef, where('email', '==', email)));
    if (!emailQuerySnap.empty) {
      const existingUser = emailQuerySnap.docs[0].data();
      if (existingUser.mobile !== decoded.mobile) {
        return NextResponse.json({ error: 'Email already registered to another number' }, { status: 400 });
      }
    }

    const dataToSave = {
      firstName,
      lastName,
      email,
      gender,
      dob: dob ? dob : null, // Store as string to avoid date parsing issues
      occupation,
      bloodGroup,
      emergencyContact,
    };

    // Create or update user
    const mobileQuerySnap = await getDocs(query(usersRef, where('mobile', '==', decoded.mobile)));
    
    let user;
    if (!mobileQuerySnap.empty) {
      const docRef = mobileQuerySnap.docs[0].ref;
      await updateDoc(docRef, dataToSave);
      user = { id: docRef.id, mobile: decoded.mobile, firstName };
    } else {
      const docRef = await addDoc(usersRef, { 
        mobile: decoded.mobile, 
        ...dataToSave, 
        role: 'CUSTOMER' 
      });
      user = { id: docRef.id, mobile: decoded.mobile, firstName };
    }

    return NextResponse.json({ success: true, user: { id: user.id, mobile: user.mobile, firstName: user.firstName } });
  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: error?.message || 'Internal server error', details: error?.stack }, { status: 500 });
  }
}
