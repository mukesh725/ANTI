import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { date, timeSlot, sessionId, location } = await request.json();

    if (!date || !timeSlot || !sessionId || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const lockRef = doc(db, 'healthBookingLocks', `${location}_${date}_${timeSlot}`);
    const lockDoc = await getDoc(lockRef);

    if (lockDoc.exists()) {
      const data = lockDoc.data();
      // Only release the lock if it was made by the current session
      if (data.sessionId === sessionId) {
        await deleteDoc(lockRef);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error releasing slot:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
