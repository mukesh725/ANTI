import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!data.phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // 1. Find the patient record with this phone number
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, where('phone', '==', data.phone));
    const patientsSnap = await getDocs(q);

    if (patientsSnap.empty) {
      return NextResponse.json({ error: 'No invite found for this phone number' }, { status: 404 });
    }

    // Usually there is only 1 patient per phone.
    const patientDoc = patientsSnap.docs[0];
    const patientData = patientDoc.data();

    if (patientData.status === 'active') {
      return NextResponse.json({ message: 'Account is already active', patientId: patientData.id });
    }

    // 2. Activate the patient profile
    const patientRef = doc(db, 'patients', patientData.id);
    await updateDoc(patientRef, {
      status: 'active',
      lastUpdated: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      patientId: patientData.id,
      message: 'Account successfully activated. Your clinical records are now private.'
    });

  } catch (error: any) {
    console.error('Error activating dependent:', error);
    return NextResponse.json({ error: error.message || 'Failed to activate account' }, { status: 500 });
  }
}
