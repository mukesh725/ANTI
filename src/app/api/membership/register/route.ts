import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { mobile: string } | null;
    
    if (!decoded || !decoded.mobile) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, email, gender, dob, occupation, bloodGroup, emergencyContact } = body;

    if (!firstName || !email) {
      return NextResponse.json({ error: 'First name and email are required' }, { status: 400 });
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.mobile !== decoded.mobile) {
      return NextResponse.json({ error: 'Email already registered to another number' }, { status: 400 });
    }

    // Create or update user
    const user = await prisma.user.upsert({
      where: { mobile: decoded.mobile },
      update: {
        firstName,
        lastName,
        email,
        gender,
        dob: dob ? new Date(dob) : null,
        occupation,
        bloodGroup,
        emergencyContact,
      },
      create: {
        mobile: decoded.mobile,
        firstName,
        lastName,
        email,
        gender,
        dob: dob ? new Date(dob) : null,
        occupation,
        bloodGroup,
        emergencyContact,
        role: 'CUSTOMER'
      }
    });

    return NextResponse.json({ success: true, user: { id: user.id, mobile: user.mobile, firstName: user.firstName } });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
