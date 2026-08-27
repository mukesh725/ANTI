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
    let maxMembers = 1;

    if (!accountSnap.exists()) {
      // Fallback: Check if they are a legacy un-migrated member in the 'Members' collection
      const membersQuery = query(collection(db, 'Members'), where('mobile', '==', data.accountId));
      const membersSnap = await getDocs(membersQuery);
      
      if (membersSnap.empty) {
        return NextResponse.json({ error: 'Account not found. Please register as a primary member first.' }, { status: 404 });
      }
      
      const legacyMember = membersSnap.docs[0].data();
      const planName = (legacyMember.membershipPlan || '').toLowerCase();
      if (planName.includes('signature')) {
        maxMembers = 5;
      } else if (planName.includes('preferred')) {
        maxMembers = 3;
      }
    } else {
      const accountData = accountSnap.data() as AccountRecord;
      maxMembers = accountData.maxMembers || 1;
    }

    // 2. Enforce Max Members Limit
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, where('accountId', '==', data.accountId));
    const patientsSnap = await getDocs(q);

    if (patientsSnap.size >= maxMembers) {
      return NextResponse.json({ error: `Member limit reached. Max members allowed: ${maxMembers}` }, { status: 400 });
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
    const patientRecord: any = {
      id: patientId,
      accountId: data.accountId,
      role: 'dependent',
      status: (data.phone || data.email) ? 'invited' : 'managed',
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      gender: data.gender,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    if (data.phone) {
      patientRecord.phone = data.phone;
    }
    if (data.email) {
      patientRecord.email = data.email;
    }

    await setDoc(doc(db, 'patients', patientId), patientRecord);

    // 5. Mock SMS/WhatsApp/Email Invite (In real world, integrate MSG91 or Twilio/SendGrid here)
    if (data.phone) {
      console.log(`[MOCK SMS] Sent to ${data.phone}: "You've been invited to join the AIRO ONE Membership by your primary account holder! Download the app and login with your phone number to activate your private profile."`);
    }
    if (data.email) {
      console.log(`[MOCK EMAIL] Sent to ${data.email}: "You've been invited to join the AIRO ONE Membership by your primary account holder! Click here to activate your private profile."`);
    }

    return NextResponse.json({ 
      success: true, 
      patientId: patientId, 
      status: patientRecord.status,
      message: (data.phone || data.email) ? 'Invite sent successfully' : 'Managed member added successfully'
    });

  } catch (error: any) {
    console.error('Error adding dependent:', error);
    return NextResponse.json({ error: error.message || 'Failed to add dependent' }, { status: 500 });
  }
}
