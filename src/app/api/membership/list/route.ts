import { NextResponse } from 'next/server';
import { getAllMembers } from '@/lib/membershipRepository';
import { verifyAdminAuth } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    const status = searchParams.get('status') || 'ALL';

    const admin = verifyAdminAuth(request);

    // If listing without a query filter, strictly require Admin Authentication
    if (!q && !admin) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Valid administrative credentials required to browse member registry.' },
        { status: 401 }
      );
    }

    // If unauthenticated query, enforce minimum character length to prevent wildcard scraping
    if (!admin && q.length < 3) {
      return NextResponse.json(
        { error: 'INVALID_QUERY', message: 'Search term must be at least 3 characters.' },
        { status: 400 }
      );
    }

    const rawMembers = await getAllMembers(q, status);

    // If caller is an admin, return full dataset
    if (admin) {
      return NextResponse.json({
        success: true,
        count: rawMembers.length,
        members: rawMembers,
      });
    }

    // For public verification (e.g. member ID card QR scanner), return sanitized fields only
    const sanitizedMembers = rawMembers.slice(0, 5).map((m) => ({
      id: m.id,
      memberId: m.memberId,
      registrationId: m.registrationId,
      firstName: m.firstName,
      lastName: m.lastName,
      membershipPlan: m.membershipPlan,
      membershipStatus: m.membershipStatus,
      activationDate: m.activationDate,
      expiryDate: m.expiryDate,
      digitalCardUrl: m.digitalCardUrl,
    }));

    return NextResponse.json({
      success: true,
      count: sanitizedMembers.length,
      members: sanitizedMembers,
    });
  } catch (error: any) {
    console.error('List Members Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to list members' },
      { status: 500 }
    );
  }
}
