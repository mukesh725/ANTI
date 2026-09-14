import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { 
  sendDoctorJoinedRoomEmail, 
  sendDoctorPrescriptionEmail 
} from '@/lib/bookingEmailService';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, consultationDocId, diagnosis, clinicalNotes, prescription, forceResend } = body;

    if (!consultationDocId || !action) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'action and consultationDocId are required.' },
        { status: 400 }
      );
    }

    let consultRef = doc(db, 'doctor_consultations', consultationDocId);
    let snap = await getDoc(consultRef);

    // Fallback: If not found directly by doc id, search by consultationId field
    if (!snap.exists()) {
      const q = query(
        collection(db, 'doctor_consultations'),
        where('consultationId', '==', consultationDocId)
      );
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        consultRef = querySnap.docs[0].ref;
        snap = querySnap.docs[0];
      }
    }

    if (!snap.exists()) {
      return NextResponse.json(
        { error: 'NOT_FOUND', message: 'Consultation record not found.' },
        { status: 404 }
      );
    }

    const data = snap.data();
    const patientEmail = data.patient?.email;
    const patientName = data.patient?.fullName || `${data.patient?.firstName || 'Valued'} ${data.patient?.lastName || 'Patient'}`.trim();
    const doctorName = data.doctor?.name || 'Physician Specialist';
    const specialty = data.doctor?.specialty || 'General Medicine';
    const consultationId = data.consultationId || data.bookingId || consultationDocId;
    const meetingLink = data.meetingLink || `/consultations/room/${consultationId}`;

    if (!patientEmail) {
      return NextResponse.json(
        { error: 'NO_PATIENT_EMAIL', message: 'No patient email registered on this consultation.' },
        { status: 400 }
      );
    }

    // 1. ACTION: DOCTOR ENTERED THE CONSULTATION ROOM
    if (action === 'DOCTOR_JOINED') {
      // Avoid sending duplicate joined alerts for same consultation unless forceResend is requested
      if (data.doctorJoinedEmailSent && !forceResend) {
        return NextResponse.json({
          success: true,
          skipped: true,
          message: 'Doctor joined notification already dispatched previously.',
        });
      }

      const sent = await sendDoctorJoinedRoomEmail({
        patientEmail,
        patientName,
        doctorName,
        specialty,
        consultationId,
        meetingLink,
      });

      if (sent) {
        await updateDoc(consultRef, {
          doctorJoinedEmailSent: true,
          doctorJoinedEmailSentAt: new Date().toISOString(),
          lastPatientEmailAlertAt: new Date().toISOString(),
        });
      }

      return NextResponse.json({
        success: sent,
        message: sent ? 'Doctor entrance email dispatched to patient.' : 'Failed to dispatch email.',
      });
    }

    // 2. ACTION: DOCTOR SAVED CLINICAL SUMMARY / PRESCRIPTION
    if (action === 'PRESCRIPTION' || action === 'CLINICAL_UPDATE') {
      const finalDiagnosis = diagnosis || data.diagnosis || data.service || 'Clinical Assessment Completed';
      const finalPrescription = prescription || data.prescription || '';
      const finalNotes = clinicalNotes || data.clinicalNotes || '';

      const sent = await sendDoctorPrescriptionEmail({
        patientEmail,
        patientName,
        doctorName,
        specialty,
        consultationId,
        diagnosis: finalDiagnosis,
        clinicalNotes: finalNotes,
        prescription: finalPrescription,
      });

      if (sent) {
        await updateDoc(consultRef, {
          prescriptionEmailSent: true,
          prescriptionEmailSentAt: new Date().toISOString(),
          diagnosis: finalDiagnosis,
          prescription: finalPrescription,
          clinicalNotes: finalNotes,
          updatedAt: new Date().toISOString(),
        });
      }

      return NextResponse.json({
        success: sent,
        message: sent ? 'Clinical prescription & summary email dispatched to patient.' : 'Failed to dispatch email.',
      });
    }

    return NextResponse.json(
      { error: 'UNKNOWN_ACTION', message: `Unrecognized action: ${action}` },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('[API /api/doctor/notify-patient Error]:', err);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: err.message || 'Server failed to send notification' },
      { status: 500 }
    );
  }
}
