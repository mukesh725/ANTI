import { NextResponse } from 'next/server';
import { generateOtp } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

const otpRateLimits = new Map<string, { count: number; resetTime: number }>();

function checkOtpRateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const record = otpRateLimits.get(key);

  if (!record || now > record.resetTime) {
    otpRateLimits.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    const { mobile } = await request.json();

    if (!mobile || mobile.length !== 10) {
      return NextResponse.json({ error: 'Invalid mobile number' }, { status: 400 });
    }

    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    const rateLimitKey = `${ip}:${cleanMobile}`;

    if (!checkOtpRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait 10 minutes before trying again.' },
        { status: 429 }
      );
    }

    const otp = generateOtp(cleanMobile);

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Failed to dispatch verification code' }, { status: 500 });
  }
}
