import { NextResponse } from 'next/server';
import { getAllMembers } from '@/lib/membershipRepository';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const status = searchParams.get('status') || 'ALL';

    const members = await getAllMembers(q, status);

    return NextResponse.json({
      success: true,
      count: members.length,
      members,
    });
  } catch (error: any) {
    console.error('List Members Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to list members' },
      { status: 500 }
    );
  }
}
