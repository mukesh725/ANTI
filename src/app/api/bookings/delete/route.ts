import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { verifyAdminAuth } from '@/lib/membershipAuth';

export async function POST(req: Request) {
  try {
    const admin = verifyAdminAuth(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized administrative access" }, { status: 401 });
    }

    const { bookingId } = await req.json();

    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json({ success: false, error: "Valid Booking ID is required" }, { status: 400 });
    }

    await deleteDoc(doc(db, "healthBookings", bookingId));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete booking." }, { status: 500 });
  }
}
