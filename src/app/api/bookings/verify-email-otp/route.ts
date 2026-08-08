import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase();
    const otpRef = doc(db, 'email_otps', emailLower);
    const otpDoc = await getDoc(otpRef);

    if (!otpDoc.exists()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    const data = otpDoc.data();

    // Check expiration
    if (Date.now() > data.expiresAt) {
      await deleteDoc(otpRef);
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // Check OTP value
    if (data.otp !== otp) {
      return NextResponse.json({ error: 'Incorrect OTP' }, { status: 400 });
    }

    // OTP is valid, delete the record so it can't be reused
    await deleteDoc(otpRef);

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Error verifying email OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
