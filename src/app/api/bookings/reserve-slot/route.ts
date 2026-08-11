import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, runTransaction } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { date, timeSlot, sessionId, location } = await request.json();

    if (!date || !timeSlot || !sessionId || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lockRef = doc(db, 'healthBookingLocks', `${location}_${date}_${timeSlot}`);
    const expiresAt = Date.now() + 5 * 60 * 1000;

    await runTransaction(db, async (transaction) => {
      const lockDoc = await transaction.get(lockRef);
      if (lockDoc.exists()) {
        const data = lockDoc.data();
        if (data.sessionId !== sessionId && data.expiresAt > Date.now()) {
          throw new Error('Slot is currently reserved by someone else');
        }
      }
      
      transaction.set(lockRef, {
        location,
        date,
        timeSlot,
        sessionId,
        expiresAt
      });
    });

    return NextResponse.json({ success: true, expiresAt });
  } catch (error: any) {
    console.error('Error reserving slot:', error);
    if (error.message === 'Slot is currently reserved by someone else') {
      return NextResponse.json({ error: error.message, success: false }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
