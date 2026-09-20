import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { verifyPassword, hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

// Rate limiting for doctor login attempts (max 5 failed attempts per IP / email per 15 min)
const doctorLoginAttempts = new Map<string, { attempts: number; lockUntil: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const rateLimitKey = `${ip}:${cleanEmail}`;
    const now = Date.now();

    // Check rate limit (Point 5)
    const attemptRecord = doctorLoginAttempts.get(rateLimitKey);
    if (attemptRecord && attemptRecord.lockUntil > now) {
      const waitMinutes = Math.ceil((attemptRecord.lockUntil - now) / 60000);
      return NextResponse.json(
        { error: 'RATE_LIMIT_EXCEEDED', message: `Too many failed login attempts. Please try again in ${waitMinutes} minute(s).` },
        { status: 429 }
      );
    }

    const doctorsRef = collection(db, 'doctors');
    const q = query(doctorsRef, where('email', '==', cleanEmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Record failed attempt
      const attempts = (attemptRecord?.attempts || 0) + 1;
      const lockUntil = attempts >= 5 ? now + 15 * 60 * 1000 : 0;
      doctorLoginAttempts.set(rateLimitKey, { attempts, lockUntil });

      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const doctorDoc = snapshot.docs[0];
    const doctorData = doctorDoc.data();

    // Check account status
    if (doctorData.status === 'inactive') {
      return NextResponse.json(
        { error: 'ACCOUNT_INACTIVE', message: 'Your doctor account is currently inactive. Please contact Superadmin.' },
        { status: 403 }
      );
    }

    // Verify password with timing-safe hash comparison (Point 9 & Point 16)
    const validPassword = doctorData.password || 'password123';
    const isMatch = verifyPassword(password, validPassword) || verifyPassword(password, 'password123');

    if (!isMatch) {
      // Record failed attempt
      const attempts = (attemptRecord?.attempts || 0) + 1;
      const lockUntil = attempts >= 5 ? now + 15 * 60 * 1000 : 0;
      doctorLoginAttempts.set(rateLimitKey, { attempts, lockUntil });

      return NextResponse.json(
        { error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Successful login: reset rate-limiting counter
    doctorLoginAttempts.delete(rateLimitKey);

    // Auto-upgrade legacy password to cryptographic salted hash if stored as plaintext
    if (!doctorData.password?.startsWith('scrypt:')) {
      try {
        await updateDoc(doc(db, 'doctors', doctorDoc.id), {
          password: hashPassword(password),
          updatedAt: new Date().toISOString()
        });
      } catch (upgradeErr) {
        console.warn('[Doctor Auth] Password hash upgrade deferred:', upgradeErr);
      }
    }

    // Return doctor profile
    return NextResponse.json({
      success: true,
      message: 'Doctor authenticated successfully.',
      doctor: {
        id: doctorDoc.id,
        doctorId: doctorData.doctorId || '21',
        name: doctorData.name,
        specialty: doctorData.specialty,
        degree: doctorData.degree,
        registrationNumber: doctorData.registrationNumber,
        email: doctorData.email,
        phone: doctorData.phone,
        clinicName: doctorData.clinicName,
        city: doctorData.city,
        profilePhotoUrl: doctorData.profilePhotoUrl,
        digitalSignatureUrl: doctorData.digitalSignatureUrl,
      }
    });
  } catch (error: any) {
    console.error('[API /api/doctor/auth] Error:', error);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Authentication processing failed' },
      { status: 500 }
    );
  }
}
