import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/membershipAuth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { mobile: string } | null;
    
    if (!decoded || !decoded.mobile) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ 
      where: { mobile: decoded.mobile },
      include: {
        memberships: {
          include: {
            plan: true,
            transactions: {
              orderBy: { createdAt: 'desc' }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const membership = user.memberships[0];

    return NextResponse.json({ 
      success: true, 
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        email: user.email,
        dob: user.dob,
        bloodGroup: user.bloodGroup
      },
      membership: membership || null 
    });
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
