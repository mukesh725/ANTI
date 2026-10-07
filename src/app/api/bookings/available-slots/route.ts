import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

function generateSlots(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  if (isNaN(date.getTime())) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Set times to midnight for comparison
  const dateCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (dateCompare < today) {
    return []; // No slots in the past
  }
  
  const slots: string[] = [];
  for (let h = 0; h <= 23; h++) { // 12 AM to 11 PM
    for (let m = 0; m < 60; m += 10) { // 10 minute intervals
      const isPM = h >= 12;
      const hour12 = h === 0 ? 12 : (h > 12 ? h - 12 : h);
      const ampm = isPM ? 'PM' : 'AM';
      const minStr = m === 0 ? '00' : m.toString();
      slots.push(`${hour12}:${minStr} ${ampm}`);
    }
  }
  return slots;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date');
    const location = searchParams.get('location');

    // 1. Validate required presence
    if (!dateStr || !location) {
      return NextResponse.json({ error: 'Date and location are required' }, { status: 400 });
    }

    // 2. Strict ISO Date Format Validation (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json({ error: 'Invalid date format. Expected YYYY-MM-DD' }, { status: 400 });
    }

    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid calendar date' }, { status: 400 });
    }

    // 3. Location Input Sanitization & Bounds Checking
    if (typeof location !== 'string' || location.trim().length === 0 || location.length > 100) {
      return NextResponse.json({ error: 'Invalid location specified' }, { status: 400 });
    }
    const cleanLocation = location.trim();

    // 4. DoS Prevention: Disallow requests beyond 180 days in the future
    const maxFutureDate = new Date();
    maxFutureDate.setDate(maxFutureDate.getDate() + 180);
    if (date > maxFutureDate) {
      return NextResponse.json({ success: true, availableSlots: [] });
    }

    // Generate all possible slots for the day
    const allSlots = generateSlots(dateStr);
    
    if (allSlots.length === 0) {
      return NextResponse.json({ success: true, availableSlots: [] });
    }

    // Query Firestore for existing bookings on this date and location
    const bookingsRef = collection(db, 'healthBookings');
    const q = query(
      bookingsRef, 
      where('date', '==', dateStr),
      where('location', '==', cleanLocation)
    );
    const snapshot = await getDocs(q);
    
    // Extract booked time slots
    const bookedSlots = snapshot.docs.map(doc => doc.data().timeSlot);

    // Query Firestore for active locks on this date and location
    const locksRef = collection(db, 'healthBookingLocks');
    const qLocks = query(
      locksRef, 
      where('date', '==', dateStr),
      where('location', '==', cleanLocation)
    );
    const locksSnapshot = await getDocs(qLocks);
    
    // Extract actively locked time slots
    const now = Date.now();
    const lockedSlots = locksSnapshot.docs
      .filter(doc => doc.data().expiresAt > now)
      .map(doc => doc.data().timeSlot);

    // Filter available slots
    const availableSlots = allSlots.filter(slot => 
      !bookedSlots.includes(slot) && !lockedSlots.includes(slot)
    );

    return NextResponse.json({ success: true, availableSlots });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
