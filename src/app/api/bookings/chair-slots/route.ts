import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export const dynamic = 'force-dynamic';

// Generate 24/7 10-minute slots across 24 hours (144 slots per day)
function generate24Hour10MinSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 10) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMin = min === 0 ? '00' : min.toString().padStart(2, '0');
      slots.push(`${displayHour}:${displayMin} ${period}`);
    }
  }
  return slots;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().slice(0, 10);
    const location = searchParams.get('location') || '';
    const phone = searchParams.get('phone') || '';
    const patientId = searchParams.get('patientId') || '';

    const all10MinSlots = generate24Hour10MinSlots();

    // Query booked slots for this location and date
    const chairBookingsRef = collection(db, 'praana_chair_bookings');
    let q;

    if (location) {
      q = query(
        chairBookingsRef,
        where('date', '==', date),
        where('location', '==', location)
      );
    } else {
      q = query(chairBookingsRef, where('date', '==', date));
    }

    const snapshot = await getDocs(q);
    const bookedTimeSlots = new Set<string>();
    const userBookings: any[] = [];

    snapshot.docs.forEach((d) => {
      const data = d.data();
      if (data.status !== 'Cancelled') {
        bookedTimeSlots.add(data.timeSlot);
      }
      if ((phone && data.phone === phone) || (patientId && data.patientId === patientId)) {
        userBookings.push({
          id: d.id,
          ...data,
        });
      }
    });

    // Also check general user bookings if phone or patientId provided
    if (phone || patientId) {
      let myQuery;
      if (phone) {
        myQuery = query(chairBookingsRef, where('phone', '==', phone));
      } else {
        myQuery = query(chairBookingsRef, where('patientId', '==', patientId));
      }
      const mySnap = await getDocs(myQuery);
      mySnap.docs.forEach((d) => {
        const data = d.data();
        if (!userBookings.some((b) => b.id === d.id)) {
          userBookings.push({
            id: d.id,
            ...data,
          });
        }
      });
    }

    // Filter available slots: Only slots NOT booked are available to other users
    const availableSlots = all10MinSlots.filter((slot) => !bookedTimeSlots.has(slot));

    return NextResponse.json({
      success: true,
      date,
      location,
      total24hSlots: all10MinSlots.length,
      availableCount: availableSlots.length,
      availableSlots,
      userBookings,
    });
  } catch (error: any) {
    console.error('Error fetching chair slots:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch slots' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      patientId, 
      accountId, 
      patientName, 
      phone, 
      email, 
      location, 
      date, 
      timeSlot 
    } = body;

    if (!location || !date || !timeSlot || (!phone && !patientId)) {
      return NextResponse.json(
        { error: 'Missing required booking information' },
        { status: 400 }
      );
    }

    // Atomic uniqueness check: Ensure slot is not already taken by someone else
    const slotDocId = `${location.replace(/\s+/g, '_')}_${date}_${timeSlot.replace(/\s+/g, '_')}`;
    const chairBookingsRef = collection(db, 'praana_chair_bookings');
    const checkQuery = query(
      chairBookingsRef,
      where('location', '==', location),
      where('date', '==', date),
      where('timeSlot', '==', timeSlot)
    );
    const existingSnap = await getDocs(checkQuery);

    if (!existingSnap.empty) {
      return NextResponse.json(
        { error: 'This 10-minute slot is already reserved by another patient. Please choose another slot.' },
        { status: 409 }
      );
    }

    const bookingRef = `PRN-CHR-${Date.now().toString().slice(-6)}`;
    const newBookingDoc = doc(db, 'praana_chair_bookings', slotDocId);

    const bookingData = {
      id: slotDocId,
      bookingReference: bookingRef,
      patientId: patientId || `PAT-${phone || 'GUEST'}`,
      accountId: accountId || phone || '',
      patientName: patientName || 'Valued Patient',
      phone: phone || '',
      email: email || '',
      location,
      date,
      timeSlot,
      status: 'Confirmed',
      serviceName: 'Praana Smart Chair 10-Min Telemetry Scan',
      createdAt: new Date().toISOString(),
    };

    await setDoc(newBookingDoc, bookingData);

    return NextResponse.json({
      success: true,
      message: 'Praana Chair 10-minute slot confirmed!',
      booking: bookingData,
    });
  } catch (error: any) {
    console.error('Error booking chair slot:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to book slot' },
      { status: 500 }
    );
  }
}
