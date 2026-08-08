import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingId, status, ...additionalFields } = body;

    if (!bookingId || !status) {
      return NextResponse.json({ error: 'Missing bookingId or status' }, { status: 400 });
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
