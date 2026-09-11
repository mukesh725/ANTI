import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { sendBookingConfirmationEmail } from '@/lib/bookingEmailService';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      careOption,
      service,
      location,
      date,
      time,
      phone,
      email,
      dob,
      firstName,
      lastName,
      address,
      legalSex,
      consents,
      userId
    } = body;

    if (!firstName || !lastName || !email || !date || !time) {
      return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
    }

    // Generate unique booking reference
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingReference = `MC-${timestamp}${randomStr}`;

    const payload = {
      careOption: careOption || 'in-person',
      service: service || 'Minute Clinic Visit',
      location: location || 'AIRO Minute Clinic',
      date,
      time,
      phone: phone || '',
      email: email.trim().toLowerCase(),
      dob: dob || '',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address || '',
      legalSex: legalSex || 'Not Specified',
      consents: consents || {},
      bookingReference,
      timestamp: new Date().toISOString(),
      status: 'confirmed',
      userId: userId || null
    };

    const docRef = await addDoc(collection(db, 'minute_clinic_bookings'), payload);

    // Dispatch professional email confirmation to the patient
    let emailSent = false;
    try {
      emailSent = await sendBookingConfirmationEmail({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        date,
        timeSlot: time,
        location: location || 'AIRO Minute Clinic',
        bookingReference,
        service: service || 'Minute Clinic Visit',
        careOption: 'in-person'
      });
    } catch (mailErr) {
      console.error('[API /api/minute-clinic/book-in-person] Email dispatch error:', mailErr);
    }

    return NextResponse.json({
      success: true,
      bookingId: docRef.id,
      bookingReference,
      emailSent
    });

  } catch (error: any) {
    console.error('[API /api/minute-clinic/book-in-person] Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
