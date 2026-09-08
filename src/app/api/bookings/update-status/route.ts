import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { verifyAdminAuth } from '@/lib/membershipAuth';

export async function POST(request: Request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized administrative access' }, { status: 401 });
    }

    const body = await request.json();
    const { bookingId, status, ...additionalFields } = body;

    if (!bookingId || !status || typeof bookingId !== 'string' || typeof status !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid bookingId or status' }, { status: 400 });
    }

    const bookingRef = doc(db, 'healthBookings', bookingId);
    
    await updateDoc(bookingRef, {
      status,
      ...additionalFields,
      updatedAt: serverTimestamp()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
