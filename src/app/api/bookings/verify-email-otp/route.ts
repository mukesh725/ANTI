import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc, increment } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body || {};

    if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
      return NextResponse.json({ error: 'Valid Email and OTP required' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const otpRef = doc(db, 'email_otps', emailLower);
    const otpDoc = await getDoc(otpRef);

    if (!otpDoc.exists()) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    const data = otpDoc.data();

    // VAPT Item 19: Check expiration
    if (Date.now() > data.expiresAt) {
      await deleteDoc(otpRef);
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    // VAPT Item 19: Brute-force guessing protection (maximum 5 attempts)
    const currentAttempts = (data.attempts || 0) + 1;
    if (currentAttempts > 5) {
      await deleteDoc(otpRef);
      return NextResponse.json(
        { error: 'Too many incorrect attempts. For security, please request a new OTP.' },
        { status: 429 }
      );
    }

    // Check OTP value
    if (data.otp !== otp.trim()) {
      await updateDoc(otpRef, { attempts: increment(1) });
      const remaining = 5 - currentAttempts;
      return NextResponse.json(
        { error: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.` },
        { status: 400 }
      );
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
