import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ success: false, error: "Booking ID is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, "healthBookings", bookingId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
