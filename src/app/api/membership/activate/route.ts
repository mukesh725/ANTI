import { NextResponse } from 'next/server';
import { activateMember } from '@/lib/membershipRepository';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationIdOrDocId, paymentMethod } = body;

    if (!registrationIdOrDocId) {
      return NextResponse.json(
        { error: 'registrationIdOrDocId parameter is required' },
        { status: 400 }
      );
    }

    const result = await activateMember({
      registrationIdOrDocId,
      paymentMethod: paymentMethod || 'Cash',
    });

    return NextResponse.json({
      success: true,
      message: 'Membership activated successfully!',
      member: result.member,
    });
  } catch (error: any) {
    console.error('Activation Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to activate membership' },
      { status: 500 }
    );
  }
}
