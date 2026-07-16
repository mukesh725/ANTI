import { NextResponse } from 'next/server';
import { generateOtp } from '@/lib/membershipAuth';

export async function POST(request: Request) {
  try {
    const { mobile } = await request.json();

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
    }

    const otp = generateOtp(mobile);
    
    // In production, integrate with SMS gateway (Twilio, Msg91, etc.) here.
    // We are logging it in generateOtp for dev purposes.

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
