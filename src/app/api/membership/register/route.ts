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

    // Send Google Chat Notification (Fire and Forget)
    try {
      const webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAQAvRqcoks/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=hpf9sY74058MHnjbAhKydzNKpr4T9Cfi6Z4AQMLrN-Y';
      const messageText = `🚨 *New Pending Registration*\n\n*Name:* ${firstName} ${lastName}\n*Plan:* ${membershipPlan}\n*Phone:* ${mobile}\n\nThis user is awaiting activation in the admin dashboard.`;
      
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageText }),
      }).catch(err => console.error('Google Chat Webhook Error:', err));
    } catch (err) {
      console.error('Google Chat Notification Failed:', err);
    }

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
