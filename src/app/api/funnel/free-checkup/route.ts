import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, store = 'Kondapur', gclid = '', utm_source = '', utm_campaign = '', page = '', website = '' } = body;

    // 1. Spam Trap / Honeypot: bots fill in the hidden website field
    if (website && String(website).trim().length > 0) {
      return NextResponse.json({
        success: true,
        bookingReference: 'FCK-SPAM',
        message: 'Booking confirmed',
      });
    }

    // 2. Name validation
    const trimmedName = String(name || '').trim().replace(/\s+/g, ' ');
    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json({ error: 'Please enter a valid name (at least 2 letters).' }, { status: 400 });
    }

    // 3. Phone validation (Indian 10-digit mobile)
    let digits = String(phone || '').replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);

    if (!/^[6-9]\d{9}$/.test(digits)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit Indian mobile number.' }, { status: 400 });
    }

    const formattedPhone = `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
    const normalizedMobile = `+91${digits}`;

    // 4. Generate unique booking reference
    const refNum = Date.now().toString().slice(-6);
    const randAlpha = Math.random().toString(36).substring(2, 5).toUpperCase();
    const bookingReference = `FCK-${refNum}${randAlpha}`;

    const nowIso = new Date().toISOString();
    const todayDate = nowIso.split('T')[0];
    const nameParts = trimmedName.split(' ');
    const firstName = nameParts[0] || trimmedName;
    const lastName = nameParts.slice(1).join(' ') || '';

    // 5. Store in "funnelLeads" collection for dedicated Funnel Data dashboard module
    const funnelRecord = {
      bookingReference,
      name: trimmedName,
      firstName,
      lastName,
      phone: formattedPhone,
      normalizedMobile,
      store: store || 'Kondapur',
      funnelName: 'Free Family Health Checkup (Kondapur)',
      source: utm_source || 'Direct / Organic',
      campaign: utm_campaign || 'Kondapur Launch',
      gclid: gclid || '',
      page: page || '/free-health-checkup-kondapur',
      status: 'New',
      notes: '',
      tags: ['Free Health Checkup', 'Kondapur', 'Praana Smart Chair'],
      submittedAt: nowIso,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const funnelDocRef = await addDoc(collection(db, 'funnelLeads'), funnelRecord);

    // 6. Store in "leads" collection for Admin Dashboard Leads tab
    const leadRecord = {
      name: trimmedName,
      phone: formattedPhone,
      email: '',
      type: 'Free Family Health Checkup',
      store: store || 'Kondapur',
      source: utm_source || 'Funnel: Free Health Checkup Kondapur',
      campaign: utm_campaign || '',
      gclid: gclid || '',
      page: page || '/free-health-checkup-kondapur',
      message: `Customer booked Free 9-Vital Health Checkup at Kondapur Hub. Requested callback.`,
      status: 'Pending',
      bookingReference,
      funnelDocId: funnelDocRef.id,
      createdAt: nowIso,
      timestamp: serverTimestamp(),
    };

    const leadRef = await addDoc(collection(db, 'leads'), leadRecord);

    // 7. Store in "healthBookings" collection for Bookings & Customer management
    const bookingRecord = {
      firstName,
      lastName,
      mobile: formattedPhone,
      normalizedMobile,
      email: '',
      date: todayDate,
      timeSlot: 'Callback Requested',
      bookingReference,
      status: 'Booked',
      location: 'Kondapur',
      visitType: 'New',
      reasonForVisit: 'Free Family Health Checkup - 9 Vitals',
      source: 'Free Checkup Funnel (Kondapur)',
      notes: `Funnel lead. Campaign: ${utm_campaign || 'direct'}. Source: ${utm_source || 'organic'}. Lead Doc: ${leadRef.id}. Funnel Doc: ${funnelDocRef.id}`,
      funnelDocId: funnelDocRef.id,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'healthBookings'), bookingRecord);

    return NextResponse.json({
      success: true,
      bookingReference,
      firstName,
      phone: formattedPhone,
      funnelDocId: funnelDocRef.id,
    });
  } catch (error: any) {
    console.error('Error handling funnel booking submission:', error);
    return NextResponse.json({ error: error?.message || 'Failed to submit booking. Please try again.' }, { status: 500 });
  }
}
