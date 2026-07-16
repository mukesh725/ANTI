import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'airo_super_secret_key_2026';

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// Dummy memory store for OTPs in development
// In production, use Redis or Database
const otpStore = new Map<string, { otp: string, expires: number }>();

export function generateOtp(mobile: string): string {
  // Always 123456 in dev, or random
  const otp = "123456"; // Hardcoded for testing
  otpStore.set(mobile, { otp, expires: Date.now() + 10 * 60 * 1000 });
  console.log(`[DEV OTP] Sent ${otp} to ${mobile}`);
  return otp;
}

export function validateOtp(mobile: string, otp: string): boolean {
  const record = otpStore.get(mobile);
  if (!record) return false;
  if (record.expires < Date.now()) {
    otpStore.delete(mobile);
    return false;
  }
  if (record.otp === otp) {
    otpStore.delete(mobile);
    return true;
  }
  return false;
}
