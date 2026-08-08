import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import {
  MemberRecord,
  PendingRegistrationInput,
  ActivateMemberInput,
  PaymentMethodType,
} from '@/types/membership';
import {
  generateMemberQRCode,
  generateDigitalMembershipCard,
} from '@/lib/membershipCardGenerator';

const COLLECTION_MEMBERS = 'Members';
const COUNTER_DOC_PATH = 'counters/members';

// ==========================================
// 6. UPDATE AND DELETE MEMBERS
// ==========================================

export async function updateMember(docId: string, updates: Partial<MemberRecord>) {
  try {
    const memberRef = doc(db, COLLECTION_MEMBERS, docId);
    
    // Ensure we don't accidentally update the ID field
    const { id, ...cleanUpdates } = updates;
    
    await updateDoc(memberRef, {
      ...cleanUpdates,
      lastUpdated: new Date().toISOString()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
}

export async function deleteMember(docId: string) {
  try {
    const memberRef = doc(db, COLLECTION_MEMBERS, docId);
    await deleteDoc(memberRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
}

// ==========================================
// 7. ACTIVATE MEMBER
// ==========================================

/**
 * Generate unique Registration ID e.g. REG2026-X89B
 */
function generateRegistrationId(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REG${timestamp}${randomStr}`;
}

/**
 * Submit new pending registration to Firebase Firestore (Members collection)
 * Also syncs/creates customer user account record in 'users' collection so customer can log in.
 */
export async function submitPendingRegistration(
  input: PendingRegistrationInput
): Promise<{ success: boolean; registrationId: string; member: MemberRecord }> {
  try {
    const regId = generateRegistrationId();
    const nowIso = new Date().toISOString();
    const cleanEmail = input.email.trim().toLowerCase();
    const cleanMobile = input.mobile.trim();

    // 0. Check for existing membership (One person = One membership)
    const membersRef = collection(db, COLLECTION_MEMBERS);
    
    // Check by email
    const emailQuerySnap = await getDocs(query(membersRef, where('email', '==', cleanEmail)));
    if (!emailQuerySnap.empty) {
      throw new Error('A membership with this email address already exists.');
    }

    // Check by mobile
    const mobileQuerySnap = await getDocs(query(membersRef, where('mobile', '==', cleanMobile)));
    if (!mobileQuerySnap.empty) {
      throw new Error('A membership with this mobile number already exists.');
    }

    // 1. Sync or Create User Profile in 'users' collection
    let userId = '';
    try {
      const usersRef = collection(db, 'users');
      const userQuerySnap = await getDocs(query(usersRef, where('email', '==', cleanEmail)));

      if (!userQuerySnap.empty) {
        const userDoc = userQuerySnap.docs[0];
        userId = userDoc.id;
        await updateDoc(userDoc.ref, {
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          name: `${input.firstName.trim()} ${input.lastName.trim()}`,
          mobile: cleanMobile,
          dob: input.dob,
          address: input.address,
          lastUpdated: nowIso,
        });
      } else {
        const newUserDoc = await addDoc(usersRef, {
          email: cleanEmail,
          mobile: cleanMobile,
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          name: `${input.firstName.trim()} ${input.lastName.trim()}`,
          dob: input.dob,
          address: input.address,
          role: 'CUSTOMER',
          createdAt: nowIso,
        });
        userId = newUserDoc.id;
      }
    } catch (e) {
      console.error('User sync error during registration:', e);
    }

    // 2. Save Membership Record in 'Members' collection
    const newMemberRecord: Omit<MemberRecord, 'id'> = {
      registrationId: regId,
      memberId: null,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      dob: input.dob,
      gender: input.gender,
      address: input.address,
      emergencyContact: input.emergencyContact || null,
      membershipPlan: input.membershipPlan,
      paymentStatus: 'Pending',
      paymentMethod: null,
      membershipStatus: 'Pending Activation',
      registrationDate: nowIso,
      activationDate: null,
      expiryDate: null,
      qrCodeUrl: null,
      digitalCardUrl: null,
      createdBy: userId ? `User:${userId}` : 'Customer Registration',
      lastUpdated: nowIso,
    };

    const docRef = await addDoc(collection(db, COLLECTION_MEMBERS), newMemberRecord);

    const savedRecord: MemberRecord = {
      id: docRef.id,
      ...newMemberRecord,
    };

    return {
      success: true,
      registrationId: regId,
      member: savedRecord,
    };
  } catch (error) {
    console.error('Error submitting pending registration:', error);
    throw error;
  }
}

/**
 * Fetch all members with optional search query & status filter
 */
export async function getAllMembers(
  searchQuery?: string,
  statusFilter?: string
): Promise<MemberRecord[]> {
  try {
    const membersRef = collection(db, COLLECTION_MEMBERS);
    const snap = await getDocs(membersRef);

    let list: MemberRecord[] = snap.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<MemberRecord, 'id'>),
    }));

    // Sort by registrationDate descending (newest first)
    list.sort(
      (a, b) =>
        new Date(b.registrationDate || 0).getTime() -
        new Date(a.registrationDate || 0).getTime()
    );

    // Apply search query (Mobile, Email, Registration ID, ONE ID, Name)
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase();
      const qClean = q.replace(/[^a-zA-Z0-9]/g, '');
      list = list.filter((m) => {
        const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
        const mIdClean = (m.memberId || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const regIdClean = (m.registrationId || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

        return (
          fullName.includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.mobile?.includes(q) ||
          m.registrationId?.toLowerCase().includes(q) ||
          m.memberId?.toLowerCase().includes(q) ||
          (qClean.length > 3 && (mIdClean.includes(qClean) || regIdClean.includes(qClean)))
        );
      });
    }

    // Apply status filter
    if (statusFilter && statusFilter !== 'ALL') {
      list = list.filter((m) => m.membershipStatus === statusFilter);
    }

    return list;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
}

/**
 * Get single member by Email, Mobile, Registration ID, ONE ID, or Document ID
 */
export async function getMemberById(idOrRegIdOrEmail: string): Promise<MemberRecord | null> {
  try {
    const cleanQuery = idOrRegIdOrEmail.trim().toLowerCase();

    // 1. Try Firestore doc ID lookup
    try {
      const docRef = doc(db, COLLECTION_MEMBERS, idOrRegIdOrEmail);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as Omit<MemberRecord, 'id'>) };
      }
    } catch (e) {}

    // 2. Query by ONE ID
    const memberIdQuery = query(
      collection(db, COLLECTION_MEMBERS),
      where('memberId', '==', idOrRegIdOrEmail)
    );
    const memberIdSnap = await getDocs(memberIdQuery);
    if (!memberIdSnap.empty) {
      const d = memberIdSnap.docs[0];
      return { id: d.id, ...(d.data() as Omit<MemberRecord, 'id'>) };
    }

    // 3. Query by Registration ID
    const regIdQuery = query(
      collection(db, COLLECTION_MEMBERS),
      where('registrationId', '==', idOrRegIdOrEmail)
    );
    const regIdSnap = await getDocs(regIdQuery);
    if (!regIdSnap.empty) {
      const d = regIdSnap.docs[0];
      return { id: d.id, ...(d.data() as Omit<MemberRecord, 'id'>) };
    }

    // 4. Query by Email
    const emailQuery = query(
      collection(db, COLLECTION_MEMBERS),
      where('email', '==', cleanQuery)
    );
    const emailSnap = await getDocs(emailQuery);
    if (!emailSnap.empty) {
      const d = emailSnap.docs[0];
      return { id: d.id, ...(d.data() as Omit<MemberRecord, 'id'>) };
    }

    // 5. Query by Mobile
    const mobileQuery = query(
      collection(db, COLLECTION_MEMBERS),
      where('mobile', '==', idOrRegIdOrEmail)
    );
    const mobileSnap = await getDocs(mobileQuery);
    if (!mobileSnap.empty) {
      const d = mobileSnap.docs[0];
      return { id: d.id, ...(d.data() as Omit<MemberRecord, 'id'>) };
    }

    return null;
  } catch (error) {
    console.error('Error getting member by ID/Email:', error);
    return null;
  }
}

/**
 * Activate a pending member (Admin function)
 * Atomically generates unique sequential ONE ID starting with AIRO-1 followed by 6 digits e.g. AIRO-1000001, QR code & Digital Card, updates record in Firestore.
 */
export async function activateMember(
  input: ActivateMemberInput
): Promise<{ success: boolean; member: MemberRecord }> {
  try {
    // Locate the member document first
    const memberRecord = await getMemberById(input.registrationIdOrDocId);
    if (!memberRecord || !memberRecord.id) {
      throw new Error(`Member not found for ID: ${input.registrationIdOrDocId}`);
    }

    if (memberRecord.membershipStatus === 'Active' && memberRecord.memberId) {
      // Already activated
      return { success: true, member: memberRecord };
    }

    // 1. Atomic Transaction to Increment Counter and Assign ONE ID (AIRO-1000001, AIRO-1000002...)
    let generatedMemberId = '';
    const counterRef = doc(db, COUNTER_DOC_PATH);

    await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      let currentSeq = 0;
      if (counterSnap.exists()) {
        currentSeq = counterSnap.data().currentSequence || 0;
      }

      const nextSeq = currentSeq + 1;
      // Format: AIRO-1 followed by 6 zero-padded sequential digits (e.g. AIRO-1000001, AIRO-1000002...)
      const paddedSeq = nextSeq.toString().padStart(6, '0');
      generatedMemberId = `AIRO-1${paddedSeq}`;

      // Set or update counter doc
      transaction.set(counterRef, {
        currentSequence: nextSeq,
        lastAssignedId: generatedMemberId,
        updatedAt: serverTimestamp(),
      });
    });

    // 2. Dates setup
    const activationDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year validity

    const nowIso = activationDate.toISOString();
    const expiryIso = expiryDate.toISOString();

    // 3. Generate QR Code (links to member page or ID)
    const verificationUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/member/${generatedMemberId}`
      : `https://airo.co.in/member/${generatedMemberId}`;
    
    const qrCodeUrl = await generateMemberQRCode(verificationUrl);

    // 4. Generate Digital Membership Card Data URL
    const digitalCardUrl = await generateDigitalMembershipCard(
      {
        ...memberRecord,
        memberId: generatedMemberId,
        expiryDate: expiryIso,
      },
      qrCodeUrl
    );

    // 5. Update Firestore Member record
    const updatedFields: Partial<MemberRecord> = {
      memberId: generatedMemberId,
      paymentStatus: 'Paid',
      paymentMethod: input.paymentMethod || 'Cash',
      membershipStatus: 'Active',
      activationDate: nowIso,
      expiryDate: expiryIso,
      qrCodeUrl,
      digitalCardUrl,
      lastUpdated: nowIso,
    };

    const targetDocRef = doc(db, COLLECTION_MEMBERS, memberRecord.id);
    await updateDoc(targetDocRef, updatedFields);

    const activatedMember: MemberRecord = {
      ...memberRecord,
      ...updatedFields,
    };

    return { success: true, member: activatedMember };
  } catch (error) {
    console.error('Error activating membership:', error);
    throw error;
  }
}
