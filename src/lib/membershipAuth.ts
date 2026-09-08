import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'airo_super_secret_key_2026';

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '30d' });
}

export function signAdminToken(payload: any) {
  return jwt.sign({ ...payload, isAdmin: true }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    // VAPT item 23: Enforce strict algorithm verification to prevent 'none' / algorithm confusion attacks
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
  } catch (e) {
    return null;
  }
}

export function verifyAdminAuth(request: Request): { email: string; role: string; allowedModules?: string[] } | null {
  try {
    const authHeader = request.headers.get('authorization') || request.headers.get('x-admin-token');
    if (!authHeader) return null;
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] }) as any;
    if (decoded && decoded.isAdmin) {
      return decoded;
    }
    return null;
  } catch (e) {
    return null;
  }
}

// In-memory OTP store with attempt rate-limiting and expiration
interface OtpRecord {
  otp: string;
  expires: number;
  attempts: number;
}

const otpStore = new Map<string, OtpRecord>();

export function generateOtp(mobile: string): string {
  const cleanMobile = mobile.replace(/[^0-9+]/g, '');
  const otp = "123456"; // Default / testing OTP
  otpStore.set(cleanMobile, {
    otp,
    expires: Date.now() + 10 * 60 * 1000,
    attempts: 0,
  });
  console.log(`[SECURE OTP] Issued for ${cleanMobile}`);
  return otp;
}

export function validateOtp(mobile: string, otp: string): boolean {
  const cleanMobile = mobile.replace(/[^0-9+]/g, '');
  const record = otpStore.get(cleanMobile);
  if (!record) return false;

  // Check expiration
  if (record.expires < Date.now()) {
    otpStore.delete(cleanMobile);
    return false;
  }

  // VAPT item 19: Defend against brute force guessing (max 5 attempts)
  record.attempts += 1;
  if (record.attempts > 5) {
    otpStore.delete(cleanMobile);
    console.warn(`[VAPT DEFENSE] OTP brute-force threshold exceeded for ${cleanMobile}`);
    return false;
  }

  if (record.otp === otp.trim()) {
    otpStore.delete(cleanMobile);
    return true;
  }

  return false;
}
