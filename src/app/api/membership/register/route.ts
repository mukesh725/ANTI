import { NextResponse } from 'next/server';
import { submitPendingRegistration } from '@/lib/membershipRepository';
import { PendingRegistrationInput } from '@/types/membership';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      mobile,
      dob,
      gender,
      address,
      emergencyContact,
      membershipPlan,
    } = body;

    // Validation
    if (!firstName || !lastName || !email || !mobile || !dob || !gender || !address || !membershipPlan) {
      return NextResponse.json(
        { error: 'Missing required fields. Please fill out all required personal and plan details.' },
        { status: 400 }
      );
    }

    const input: PendingRegistrationInput = {
      firstName,
      lastName,
      email,
      mobile,
      dob,
      gender,
      address,
      emergencyContact,
      membershipPlan,
    };

    const result = await submitPendingRegistration(input);

    return NextResponse.json({
      success: true,
      message: 'Registration submitted successfully. Pending payment & activation.',
      registrationId: result.registrationId,
      member: result.member,
    });
  } catch (error: any) {
    console.error('Registration Route Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to submit registration' },
      { status: 500 }
    );
  }
}
