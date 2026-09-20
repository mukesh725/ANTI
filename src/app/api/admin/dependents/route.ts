import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { verifyAdminAuth } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Valid administrative credentials required.' },
        { status: 401 }
      );
    }

    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, where('role', '==', 'dependent'));
    const snapshot = await getDocs(q);

    const dependents = snapshot.docs.map(doc => ({
      ...doc.data()
    }));

    // Sort by createdAt descending
    dependents.sort((a: any, b: any) => {
      const aDate = new Date(a.createdAt || 0).getTime();
      const bDate = new Date(b.createdAt || 0).getTime();
      return bDate - aDate;
    });

    return NextResponse.json({
      success: true,
      dependents,
    });
  } catch (error: any) {
    console.error('List Dependents Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to list dependents' },
      { status: 500 }
    );
  }
}
