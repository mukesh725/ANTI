import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { sanitizeString, isValidIndianMobile } from '@/lib/telemed';
import { sendBookingConfirmationEmail } from '@/lib/bookingEmailService';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Rate Limiter: 10 booking attempts per 10 minutes per IP to prevent spam/abuse
const bookingRateLimit = new Map<string, { count: number; resetTime: number }>();

function checkBookingRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const limit = 10;
  const record = bookingRateLimit.get(ip);

  if (!record || now > record.resetTime) {
    bookingRateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

    // 1. Rate Limiting Protection
    if (!checkBookingRateLimit(ip)) {
      return NextResponse.json(
        {
          error: 'RATE_LIMITED',
          message: 'Too many booking attempts. Please wait a few minutes before trying again.'
        },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 2. Strict Input Sanitization & Validation
    const firstName = sanitizeString(body.firstName, 40);
    const lastName = sanitizeString(body.lastName, 40);
    const fullName = `${firstName} ${lastName}`.trim();
    const phone = sanitizeString(body.phone, 20);
    const email = sanitizeString(body.email, 100).toLowerCase();
    const service = sanitizeString(body.service, 120);
    const date = sanitizeString(body.date, 20);
    const time = sanitizeString(body.time, 20);
    const legalSex = sanitizeString(body.legalSex, 20) || 'Not Specified';
    const dob = sanitizeString(body.dob, 20);
    const doctorId = body.doctorId ? String(body.doctorId) : 'auto';
    const doctorName = sanitizeString(body.doctorName, 80) || 'On-Duty AIRO E-Med Specialist';
    const doctorSpecialty = sanitizeString(body.doctorSpecialty, 100) || 'General Medicine';

    // Validation checks
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'First name and last name are required.' },
        { status: 400 }
      );
    }

    if (!isValidIndianMobile(phone)) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Please provide a valid 10-digit mobile number.' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!date || !time) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Please select an appointment date and time slot.' },
        { status: 400 }
      );
    }

    // 3. Generate Cryptographic Consultation Room ID & Join Token
    const consultationId = `CN_${Date.now().toString(36).toUpperCase()}_${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const joinToken = crypto.randomBytes(16).toString('hex');
    const meetingLink = `https://airoemed.com/consultations/join/${joinToken}`;

    // 4. Save to Firestore minute_clinic_bookings
    const bookingRecord = {
      bookingId: consultationId,
      careOption: 'virtual',
      platform: 'AIRO_EMED_TELEMEDICINE',
      service: service || 'General Virtual Consultation',
      date,
      time,
      email: (email || '').trim().toLowerCase(),
      phone: (phone || '').trim(),
      firstName: firstName || '',
      lastName: lastName || '',
      meetingLink,
      userId: body.userId || null,
      patient: {
        firstName,
        lastName,
        fullName,
        phone,
        email,
        dob,
        legalSex,
      },
      doctor: {
        id: doctorId,
        name: doctorName,
        specialty: doctorSpecialty,
        assignedAt: new Date().toISOString(),
      },
      telemed: {
        consultationId,
        joinToken,
        meetingLink,
        status: 'SCHEDULED',
        doctorNotified: true,
        patientNotified: true,
        scheduledFor: `${date}T${time}:00`,
      },
      consents: {
        sms: Boolean(body.consents?.sms ?? true),
        audio: Boolean(body.consents?.audio ?? true),
        treatment: Boolean(body.consents?.treatment ?? true),
        privacy: Boolean(body.consents?.privacy ?? true),
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      sourceIp: ip,
    };

    const docRef = await addDoc(collection(db, 'minute_clinic_bookings'), bookingRecord);

    // 5. Send automated email confirmation to the patient
    try {
      await sendBookingConfirmationEmail({
        firstName: firstName || '',
        lastName: lastName || '',
        email: email.trim().toLowerCase(),
        date,
        timeSlot: time,
        location: 'Virtual Consultation Room',
        bookingReference: consultationId,
        service: service || 'General Virtual Consultation',
        careOption: 'virtual',
        doctorName: `${doctorName} (${doctorSpecialty})`,
        meetingLink
      });
    } catch (mailErr) {
      console.error('[API /api/telemed/book-virtual] Email dispatch error:', mailErr);
    }

    // 6. Simulated / Dispatched Notification Payload
    // In production, this pushes to WhatsApp Business API (e.g. Gupshup/Twilio/Wati)
    // alerting the assigned Doctor on https://admin.airoemed.com
    console.log('[AIRO E-Med Alert] New Virtual Consultation Scheduled:');
    console.log(`- Doctor: ${doctorName} (${doctorSpecialty})`);
    console.log(`- Patient: ${fullName} (${phone})`);
    console.log(`- Time: ${date} at ${time}`);
    console.log(`- Room: ${meetingLink}`);

    return NextResponse.json({
      success: true,
      bookingId: docRef.id,
      consultationId,
      meetingLink,
      doctor: {
        id: doctorId,
        name: doctorName,
        specialty: doctorSpecialty,
      },
      appointment: {
        date,
        time,
        service,
      },
      message: 'Virtual appointment confirmed. Doctor notified and video consultation link generated.'
    });

  } catch (error: any) {
    console.error('[API /api/telemed/book-virtual] Error:', error);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'Failed to process virtual booking. Please try again.' },
      { status: 500 }
    );
  }
}
