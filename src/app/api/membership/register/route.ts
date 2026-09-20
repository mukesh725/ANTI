import { NextResponse } from 'next/server';
import { submitPendingRegistration } from '@/lib/membershipRepository';
import { PendingRegistrationInput } from '@/types/membership';
import { sanitizeObject, sanitizePhone, escapeHtml } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const rawBody = await request.json();
    const body = sanitizeObject(rawBody);

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

    // Strict validation (Point 7: Server-side input validation)
    if (!firstName || !lastName || !email || !mobile || !dob || !gender || !address || !membershipPlan) {
      return NextResponse.json(
        { error: 'Missing required fields. Please fill out all required personal and plan details.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 100) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanMobile = sanitizePhone(String(mobile));
    if (cleanMobile.length < 10 || cleanMobile.length > 15) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 });
    }

    const input: PendingRegistrationInput = {
      firstName: escapeHtml(String(firstName).trim().slice(0, 50)),
      lastName: escapeHtml(String(lastName).trim().slice(0, 50)),
      email: cleanEmail,
      mobile: cleanMobile,
      dob: String(dob).slice(0, 20),
      gender: String(gender).slice(0, 20),
      address: escapeHtml(String(address).trim().slice(0, 250)),
      emergencyContact: emergencyContact ? sanitizePhone(String(emergencyContact)) : undefined,
      membershipPlan: String(membershipPlan).slice(0, 50),
    };

    const result = await submitPendingRegistration(input);

    // Send Google Chat Notification (Fire and Forget)
    try {
      const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL || 'https://chat.googleapis.com/v1/spaces/AAQAvRqcoks/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=hpf9sY74058MHnjbAhKydzNKpr4T9Cfi6Z4AQMLrN-Y';
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
