import { NextResponse } from 'next/server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
import { validateOtp, signToken } from '@/lib/membershipAuth';

export async function POST(request: Request) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json({ error: 'Mobile and OTP required' }, { status: 400 });
    }

    const isValid = validateOtp(mobile, otp);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Create a token that holds the mobile number.
    const token = signToken({ mobile });

    // Try to find existing user in Firebase
    let isNewUser = true;
    try {
      const usersRef = collection(db, 'users');
      const userSnapshot = await getDocs(query(usersRef, where('mobile', '==', mobile)));
      if (!userSnapshot.empty) isNewUser = false;
    } catch (e) {
      console.error("Firebase error checking user:", e);
    }

    return NextResponse.json({ 
      success: true, 
      token, 
      isNewUser 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
