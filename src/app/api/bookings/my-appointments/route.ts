import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email')?.toLowerCase().trim() || '';
    const phone = searchParams.get('phone')?.trim() || '';
    const mobile = searchParams.get('mobile')?.trim() || '';
    const patientId = searchParams.get('patientId')?.trim() || '';

    const cleanPhone = phone || mobile;

    const appointments: any[] = [];

    // 1. Check Minute Clinic Bookings
    const clinicRef = collection(db, 'minute_clinic_bookings');
    let clinicSnap;

    if (email) {
      clinicSnap = await getDocs(query(clinicRef, where('email', '==', email)));
    } else if (cleanPhone) {
      clinicSnap = await getDocs(query(clinicRef, where('phone', '==', cleanPhone)));
    } else {
      clinicSnap = await getDocs(clinicRef);
    }

    clinicSnap.docs.forEach((doc) => {
      const d = doc.data();
      appointments.push({
        id: doc.id,
        type: 'Minute Clinic',
        service: d.service || 'Minute Clinic Visit',
        careOption: d.careOption || 'In-Person Clinic',
        date: d.date,
        time: d.time || d.timeSlot,
        location: d.location || 'AIRO Health Hub Clinic',
        status: d.status || 'Confirmed',
        bookingReference: d.bookingReference || doc.id,
        patientName: d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Patient',
        patientEmail: d.email,
        patientPhone: d.phone || d.mobile,
        timestamp: d.timestamp || d.createdAt || new Date().toISOString(),
      });
    });

    // 2. Check Health Checkup Scans (healthBookings)
    const healthRef = collection(db, 'healthBookings');
    let healthSnap;

    if (email) {
      healthSnap = await getDocs(query(healthRef, where('email', '==', email)));
    } else if (cleanPhone) {
      healthSnap = await getDocs(query(healthRef, where('mobile', '==', cleanPhone)));
    } else {
      healthSnap = await getDocs(healthRef);
    }

    healthSnap.docs.forEach((doc) => {
      const d = doc.data();
      appointments.push({
        id: doc.id,
        type: 'Health Scan',
        service: 'Free Comprehensive Health Scan',
        careOption: 'In-Person Smart Chair Station',
        date: d.date,
        time: d.timeSlot || d.time,
        location: d.location || 'AIRO Smart Health Station',
        status: d.status || 'Confirmed',
        bookingReference: d.bookingReference || doc.id,
        patientName: `${d.firstName || ''} ${d.lastName || ''}`.trim() || 'Patient',
        patientEmail: d.email,
        patientPhone: d.mobile || d.phone,
        timestamp: d.createdAt ? (d.createdAt.toDate ? d.createdAt.toDate().toISOString() : new Date().toISOString()) : new Date().toISOString(),
      });
    });

    // Sort descending by date/timestamp
    appointments.sort((a, b) => new Date(b.timestamp || b.date || 0).getTime() - new Date(a.timestamp || a.date || 0).getTime());

    return NextResponse.json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error: any) {
    console.error('Error fetching patient appointments:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}
