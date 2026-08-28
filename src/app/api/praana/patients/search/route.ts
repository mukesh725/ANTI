import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { PatientSearchResult } from '@/types/praana';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim().toLowerCase();

    const results: PatientSearchResult[] = [];

    // 1. Query Members (Primary accounts)
    const membersRef = collection(db, 'Members');
    const membersSnap = await getDocs(membersRef);

    membersSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      const name = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unnamed Member';
      const phone = data.mobile || '';
      const email = data.email || '';
      const id = data.memberId || data.registrationId || docSnap.id;
      const accountId = phone || docSnap.id;

      if (!q || 
          name.toLowerCase().includes(q) || 
          phone.toLowerCase().includes(q) || 
          email.toLowerCase().includes(q) || 
          id.toLowerCase().includes(q)) {
        results.push({
          id,
          name,
          phone,
          email,
          role: 'primary',
          accountId,
          membershipPlan: data.membershipPlan || 'AIRO ONE',
        });
      }
    });

    // 2. Query Patients (Dependents / Family Members)
    const patientsRef = collection(db, 'patients');
    const patientsSnap = await getDocs(patientsRef);

    patientsSnap.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.role === 'dependent') {
        const name = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Family Dependent';
        const phone = data.phone || '';
        const email = data.email || '';
        const id = data.id || docSnap.id;
        const accountId = data.accountId || '';

        if (!q || 
            name.toLowerCase().includes(q) || 
            phone.toLowerCase().includes(q) || 
            email.toLowerCase().includes(q) || 
            id.toLowerCase().includes(q) ||
            accountId.toLowerCase().includes(q)) {
          results.push({
            id,
            name,
            phone,
            email,
            role: 'dependent',
            accountId,
            membershipPlan: 'Family Dependent',
          });
        }
      }
    });

    return NextResponse.json({
      success: true,
      count: results.length,
      patients: results.slice(0, 30),
    });
  } catch (error: any) {
    console.error('Error searching Praana patients:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to search patients' },
      { status: 500 }
    );
  }
}
