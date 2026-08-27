import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { InviteDependentInput, PatientRecord, AccountRecord } from '@/types/membership';

function generatePatientId() {
  return `PT-${Math.floor(100000 + Math.random() * 900000)}`;
}

export async function POST(req: Request) {
  try {
    const data: InviteDependentInput = await req.json();

    if (!data.accountId || !data.firstName || !data.lastName || !data.dob) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Verify Account Exists
    const accountRef = doc(db, 'accounts', data.accountId);
    const accountSnap = await getDoc(accountRef);

    if (!accountSnap.exists()) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }
    const accountData = accountSnap.data() as AccountRecord;

    // 2. Enforce Max Members Limit
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, where('accountId', '==', data.accountId));
    const patientsSnap = await getDocs(q);

    if (patientsSnap.size >= accountData.maxMembers) {
      return NextResponse.json({ error: `Member limit reached. Max members allowed: ${accountData.maxMembers}` }, { status: 400 });
    }

    // 3. Handle Phone Constraints (If provided)
    if (data.phone) {
      const phoneQuery = query(patientsRef, where('phone', '==', data.phone));
      const phoneSnap = await getDocs(phoneQuery);
      
      if (!phoneSnap.empty) {
        // Feature Request from user: "handling a phone that already belongs to an existing AIRO account (link/switch rather than create a duplicate)"
        // For now we will return an error instructing the frontend to prompt a link flow, as a full link flow requires user consent OTP.
        return NextResponse.json({ 
          error: 'Phone number is already associated with another account.',
          code: 'PHONE_EXISTS'
        }, { status: 409 });
      }
    }

    // 4. Create Patient Record
    const patientId = generatePatientId();
    const patientRecord: PatientRecord = {
      id: patientId,
      accountId: data.accountId,
      role: 'dependent',
      status: data.phone ? 'invited' : 'managed',
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      gender: data.gender,
      phone: data.phone || undefined,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    await setDoc(doc(db, 'patients', patientId), patientRecord);

    // 5. Mock SMS/WhatsApp Invite (In real world, integrate MSG91 or Twilio here)
    if (data.phone) {
      console.log(`[MOCK SMS] Sent to ${data.phone}: "You've been invited to join the AIRO ONE Membership by your primary account holder! Download the app and login with your phone number to activate your private profile."`);
    }

    return NextResponse.json({ 
      success: true, 
      patientId: patientId, 
      status: patientRecord.status,
      message: data.phone ? 'Invite sent successfully via SMS' : 'Managed member added successfully'
    });

  } catch (error: any) {
    console.error('Error adding dependent:', error);
    return NextResponse.json({ error: error.message || 'Failed to add dependent' }, { status: 500 });
  }
}
