import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { signAdminToken } from '@/lib/membershipAuth';

// In-memory rate limiting for admin login attempts (max 5 failed attempts per IP / email per 15 min)
const loginAttempts = new Map<string, { attempts: number; lockUntil: number }>();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-ip';
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Valid credentials are required.' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const rateLimitKey = `${ip}:${cleanEmail}`;
    const now = Date.now();

    // Check rate limit
    const attemptRecord = loginAttempts.get(rateLimitKey);
    if (attemptRecord && attemptRecord.lockUntil > now) {
      const waitMinutes = Math.ceil((attemptRecord.lockUntil - now) / 60000);
      return NextResponse.json(
        { error: `Account locked due to multiple failed attempts. Try again in ${waitMinutes} minute(s).` },
        { status: 429 }
      );
    }

    // 1. Check Super Admin Server Credentials
    const superAdminEmail = process.env.ADMIN_EMAIL || 'admin@airo.dev';
    const superAdminPassword = process.env.ADMIN_PASSWORD || 'airohealthadmin2026';

    let authenticatedUser: any = null;

    if (cleanEmail === superAdminEmail.toLowerCase() && password === superAdminPassword) {
      authenticatedUser = {
        id: 'super_admin',
        name: 'Super Admin',
        email: superAdminEmail,
        role: 'Super Admin',
        allowedModules: ['all'],
        status: 'active'
      };
    } else {
      // 2. Query admin_users collection
      const q = query(
        collection(db, 'admin_users'),
        where('email', '==', cleanEmail)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        if (docData.password === password) {
          if (docData.status === 'disabled') {
            return NextResponse.json({ error: 'This administrative account has been deactivated.' }, { status: 403 });
          }
          authenticatedUser = {
            id: snapshot.docs[0].id,
            name: docData.name || docData.username || 'Admin User',
            email: docData.email,
            role: docData.role || 'Staff',
            allowedModules: docData.allowedModules || ['dashboard'],
            status: docData.status || 'active'
          };
        }
      }
    }

    if (!authenticatedUser) {
      // Track failed attempt
      const attempts = (attemptRecord?.attempts || 0) + 1;
      const lockUntil = attempts >= 5 ? now + 15 * 60 * 1000 : 0;
      loginAttempts.set(rateLimitKey, { attempts, lockUntil });

      return NextResponse.json({ error: 'Invalid administrative credentials.' }, { status: 401 });
    }

    // Reset attempts on successful login
    loginAttempts.delete(rateLimitKey);

    // Issue signed Admin JWT
    const token = signAdminToken({
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      role: authenticatedUser.role,
      allowedModules: authenticatedUser.allowedModules
    });

    return NextResponse.json({
      success: true,
      token,
      user: authenticatedUser
    });

  } catch (error: any) {
    console.error('Admin login exception:', error);
    return NextResponse.json({ error: 'Internal administrative server error.' }, { status: 500 });
  }
}
