import { NextResponse } from 'next/server';
import { validateOtp, signToken } from '@/lib/membershipAuth';
import { prisma } from '@/lib/prisma'; // Assuming we need to export prisma

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

    // Check if user exists
    // We need to import prisma client. I'll assume it exists at '@/lib/prisma'
    // For now I'll create a token that just holds the mobile number.
    const token = signToken({ mobile });

    // Try to find existing user
    let isNewUser = true;
    try {
      const user = await prisma.user.findUnique({ where: { mobile } });
      if (user) isNewUser = false;
    } catch (e) {
      console.error("Prisma error checking user:", e);
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
