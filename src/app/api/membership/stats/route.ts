import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coll = collection(db, "Members");
    const snapshot = await getCountFromServer(coll);
    const count = snapshot.data().count;

    return NextResponse.json({
      success: true,
      count: count,
    });
  } catch (error: any) {
    console.error('Stats Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
