import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const docRef = doc(db, 'settings', 'locations');
    const docSnap = await getDoc(docRef);

    let list = ['Kondapur Store', 'Kompally Hub', 'Jubilee Hills Clinic', 'Gachibowli Center'];
    if (docSnap.exists() && docSnap.data().list) {
      list = docSnap.data().list;
    }

    return NextResponse.json({
      success: true,
      locations: list,
    });
  } catch (error: any) {
    console.error('Error fetching store locations:', error);
    return NextResponse.json(
      { success: false, locations: ['Kondapur Store', 'Kompally Hub'] },
      { status: 200 }
    );
  }
}
