import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, updateDoc } from 'firebase/firestore';
import { signToken } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

// ============================================================================
// LAYER 02: RATE LIMITING (Sliding Window by IP: max 5 attempts per 10 mins)
// ============================================================================
interface RateLimitEntry {
  count: number;
  resetAt: number;
}
const rateLimitStore = new Map<string, RateLimitEntry>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function checkRateLimit(ip: string): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { limited: true, retryAfterSeconds: retryAfter };
  }

  entry.count += 1;
  return { limited: false, retryAfterSeconds: 0 };
}

// Reset rate limiter on successful login
function resetRateLimit(ip: string) {
  rateLimitStore.delete(ip);
}

// ============================================================================
// LAYER 03: PASSWORD HASHING (Scrypt with 16-byte cryptographically secure salt)
// ============================================================================
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, s, 64).toString('hex');
  return { hash, salt: s };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computed = crypto.scryptSync(password, salt, 64).toString('hex');
    const computedBuf = Buffer.from(computed, 'hex');
    const hashBuf = Buffer.from(hash, 'hex');
    if (computedBuf.length !== hashBuf.length) return false;
    return crypto.timingSafeEqual(computedBuf, hashBuf);
  } catch {
    return false;
  }
}

// ============================================================================
// AUTH HANDLER
// ============================================================================
export async function POST(request: Request) {
  // 1. Resolve client IP for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = forwarded ? forwarded.split(',')[0].trim() : realIp || '127.0.0.1';

  // 2. Enforce Layer 02: Rate limiting
  const { limited, retryAfterSeconds } = checkRateLimit(clientIp);
  if (limited) {
    return NextResponse.json(
      { 
        success: false, 
        error: `Too many sign-in attempts. For your security, please wait ${Math.ceil(retryAfterSeconds / 60)} minute(s) before trying again.` 
      },
      { 
        status: 429,
        headers: { 'Retry-After': String(retryAfterSeconds) }
      }
    );
  }

  try {
    const body = await request.json();
    const { email, password, name, mode = 'login' } = body;

    // 3. Enforce Layer 01: Server-side input validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid email address is required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json({ success: false, error: 'Password must be between 6 and 128 characters.' }, { status: 400 });
    }

    const cleanName = (name && typeof name === 'string') 
      ? name.replace(/[<>]/g, '').trim().slice(0, 80)
      : cleanEmail.split('@')[0];

    // 4. Query Firestore 'users' collection
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', cleanEmail));
    const querySnapshot = await getDocs(q);

    // ========================================================================
    // SIGN UP FLOW
    // ========================================================================
    if (mode === 'signup') {
      if (!querySnapshot.empty) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists. Please sign in.' },
          { status: 409 }
        );
      }

      const { hash, salt } = hashPassword(password);
      const userDocRef = doc(usersRef);
      const newUser = {
        uid: userDocRef.id,
        email: cleanEmail,
        name: cleanName,
        passwordHash: hash,
        salt,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(userDocRef, newUser);
      resetRateLimit(clientIp);

      const token = signToken({ uid: userDocRef.id, email: cleanEmail, role: 'CUSTOMER' });

      return NextResponse.json({
        success: true,
        user: {
          uid: userDocRef.id,
          email: cleanEmail,
          name: cleanName,
        },
        token,
      });
    }

    // ========================================================================
    // SIGN IN FLOW
    // ========================================================================
    // Layer 04: Don't leak whether email exists
    const genericInvalidMessage = 'Invalid email or password.';

    if (querySnapshot.empty) {
      return NextResponse.json({ success: false, error: genericInvalidMessage }, { status: 401 });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // If password hash exists, verify it securely
    if (userData.passwordHash && userData.salt) {
      const isValid = verifyPassword(password, userData.passwordHash, userData.salt);
      if (!isValid) {
        return NextResponse.json({ success: false, error: genericInvalidMessage }, { status: 401 });
      }
    } else {
      // Legacy or social user setting password for the first time: set salted hash
      const { hash, salt } = hashPassword(password);
      await updateDoc(doc(db, 'users', userDoc.id), {
        passwordHash: hash,
        salt,
        updatedAt: new Date().toISOString(),
      });
    }

    // Successful login: reset rate limiter
    resetRateLimit(clientIp);

    const token = signToken({ uid: userDoc.id, email: cleanEmail, role: userData.role || 'CUSTOMER' });

    const userProfile = {
      uid: userDoc.id,
      email: userData.email || cleanEmail,
      name: userData.name || cleanName,
      mobile: userData.mobile,
      firstName: userData.firstName,
      lastName: userData.lastName,
      dob: userData.dob,
      gender: userData.gender,
      address: userData.address,
      city: userData.city,
      stateText: userData.stateText,
      zip: userData.zip,
    };

    return NextResponse.json({
      success: true,
      user: userProfile,
      token,
    });
  } catch (error: any) {
    console.error('Customer login API error:', error);
    return NextResponse.json(
      { success: false, error: 'A secure authentication service error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
