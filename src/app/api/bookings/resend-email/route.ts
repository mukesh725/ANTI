import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { sendBookingConfirmationEmail } from '@/lib/bookingEmailService';

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const bookingRef = doc(db, 'healthBookings', bookingId);
    const bookingSnap = await getDoc(bookingRef);

    if (!bookingSnap.exists()) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookingData = bookingSnap.data();

    // Re-send email
    const emailSent = await sendBookingConfirmationEmail({
      firstName: bookingData.firstName,
      lastName: bookingData.lastName,
      email: bookingData.email,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      location: bookingData.location,
      bookingReference: bookingData.bookingReference
    });

    if (emailSent) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to send email via Brevo' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error resending email:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
