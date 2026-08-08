import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get('q');

    if (!searchQuery) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const cleanQuery = searchQuery.trim().toLowerCase();
    const bookingsRef = collection(db, 'healthBookings');
    let q;

    // Check if it's an email or a booking reference or a mobile number
    if (cleanQuery.includes('@')) {
      q = query(bookingsRef, where('email', '==', cleanQuery), limit(1));
    } else if (cleanQuery.startsWith('scn-')) {
      q = query(bookingsRef, where('bookingReference', '==', cleanQuery.toUpperCase()), limit(1));
    } else {
      // Treat as mobile number
      q = query(bookingsRef, where('mobile', '==', cleanQuery), limit(1));
    }

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json({ error: 'No booking found with this information.' }, { status: 404 });
    }

    const bookingDoc = snapshot.docs[0];
    const bookingData = bookingDoc.data();

    return NextResponse.json({ 
      success: true, 
      booking: {
        id: bookingDoc.id,
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        date: bookingData.date,
        timeSlot: bookingData.timeSlot,
        bookingReference: bookingData.bookingReference,
        status: bookingData.status
      }
    });
  } catch (error) {
    console.error('Error looking up booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
