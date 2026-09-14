import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, where } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');

    const consultationsRef = collection(db, 'doctor_consultations');
    const q = query(consultationsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    let consultations = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    // If specific doctor requested (and not 'all')
    if (doctorId && doctorId !== 'all') {
      consultations = consultations.filter((c: any) => 
        String(c.doctor?.id) === String(doctorId) || 
        c.doctor?.name?.toLowerCase().includes(doctorId.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      count: consultations.length,
      consultations,
    });
  } catch (error: any) {
    console.error('[API /api/doctor/consultations] Error fetching consultations:', error);
    return NextResponse.json(
      { error: 'FETCH_FAILED', message: error.message || 'Failed to fetch doctor consultations' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { consultationDocId, status, diagnosis, clinicalNotes, prescription } = body;

    if (!consultationDocId) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'consultationDocId is required.' },
        { status: 400 }
      );
    }

    const consultRef = doc(db, 'doctor_consultations', consultationDocId);
    const updatePayload: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (status) updatePayload.status = status;
    if (diagnosis !== undefined) updatePayload.diagnosis = diagnosis;
    if (clinicalNotes !== undefined) updatePayload.clinicalNotes = clinicalNotes;
    if (prescription !== undefined) updatePayload.prescription = prescription;

    await updateDoc(consultRef, updatePayload);

    return NextResponse.json({
      success: true,
      message: 'Consultation updated successfully.',
      updatedFields: updatePayload,
    });
  } catch (error: any) {
    console.error('[API /api/doctor/consultations] Error updating consultation:', error);
    return NextResponse.json(
      { error: 'UPDATE_FAILED', message: error.message || 'Failed to update consultation' },
      { status: 500 }
    );
  }
}
