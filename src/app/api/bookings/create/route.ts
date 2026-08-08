import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { sendBookingConfirmationEmail } from '@/lib/bookingEmailService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, mobile, date, timeSlot, dob, age, sex, occupation, height } = body;

    if (!firstName || !lastName || !email || !mobile || !date || !timeSlot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Double check if slot is already taken to prevent race conditions
    const bookingsRef = collection(db, 'healthBookings');
    const qSlot = query(
      bookingsRef, 
      where('date', '==', date), 
      where('timeSlot', '==', timeSlot)
    );
    const snapshotSlot = await getDocs(qSlot);

    if (!snapshotSlot.empty) {
      return NextResponse.json({ error: 'Time slot is already booked. Please choose another.' }, { status: 409 });
    }

    // Check if the user has already booked a slot previously
    const qEmail = query(bookingsRef, where('email', '==', email.trim().toLowerCase()));
    const snapshotEmail = await getDocs(qEmail);
    
    const qMobile = query(bookingsRef, where('mobile', '==', mobile.trim()));
    const snapshotMobile = await getDocs(qMobile);

    if (!snapshotEmail.empty || !snapshotMobile.empty) {
      return NextResponse.json({ 
        error: 'Want more check ups? Try out membership benefits to get unlimited access.',
        isDuplicate: true 
      }, { status: 403 });
    }

    // Generate unique booking reference
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingReference = `SCN-${timestamp}${randomStr}`;

    // Save booking to Firestore
    const docRef = await addDoc(bookingsRef, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      dob: dob || null,
      age: age || null,
      sex: sex || null,
      occupation: occupation || null,
      height: height || null,
      date,
      timeSlot,
      bookingReference,
      status: 'Confirmed',
      createdAt: serverTimestamp(),
    });

    // Send confirmation email
    const emailSent = await sendBookingConfirmationEmail({
      firstName,
      lastName,
      email,
      date,
      timeSlot,
      bookingReference
    });

    return NextResponse.json({ 
      success: true, 
      bookingId: docRef.id,
      bookingReference,
      emailSent 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
