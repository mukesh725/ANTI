import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

function generateSlots(dateStr: string) {
  const date = new Date(dateStr);
  const targetDate = new Date(2026, 7, 21); // Aug 21, 2026
  
  // Set times to midnight for comparison
  const dateCompare = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  if (dateCompare < targetDate) {
    return []; // No slots before Aug 21, 2026
  }
  
  const isOpeningDay = dateCompare.getTime() === targetDate.getTime();
  
  const slots: string[] = [];
  for (let h = 0; h <= 23; h++) { // 12 AM to 11 PM
    for (let m = 0; m < 60; m += 10) { // 10 minute intervals
      // On opening day, slots start at 12:30 PM
      if (isOpeningDay) {
        if (h < 12 || (h === 12 && m < 30)) {
          continue;
        }
      }

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

    if (!dateStr || !location) {
      return NextResponse.json({ error: 'Date and location are required' }, { status: 400 });
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
      where('location', '==', location)
    );
    const snapshot = await getDocs(q);
    
    // Extract booked time slots
    const bookedSlots = snapshot.docs.map(doc => doc.data().timeSlot);

    // Query Firestore for active locks on this date and location
    const locksRef = collection(db, 'healthBookingLocks');
    const qLocks = query(
      locksRef, 
      where('date', '==', dateStr),
      where('location', '==', location)
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
