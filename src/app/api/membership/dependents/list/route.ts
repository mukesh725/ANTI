import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { PatientRecord } from '@/types/membership';

// Utility to calculate age from a YYYY-MM-DD or similar date string
function calculateAge(dobString: string): number {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get('accountId'); // E.g., primary's phone +1234567890

    if (!accountId) {
      return NextResponse.json({ error: 'accountId is required' }, { status: 400 });
    }

    // 1. Fetch all patients under this account
    const patientsRef = collection(db, 'patients');
    const q = query(patientsRef, where('accountId', '==', accountId));
    const patientsSnap = await getDocs(q);

    const allPatients = patientsSnap.docs.map(doc => ({
      ...doc.data()
    })) as PatientRecord[];

    // 2. Apply Privacy & Visibility Rules (The "Age Rule")
    // Note: The primary ALWAYS sees themselves.
    // Dependents are visible IF:
    // a) They are status 'managed' (no phone/login), OR
    // b) Their calculated age is under 18.
    
    const visiblePatients = allPatients.map(patient => {
      const isPrimary = patient.role === 'primary';
      const age = calculateAge(patient.dob);
      
      const isVisibleToPrimary = 
        isPrimary || 
        patient.status === 'managed' || 
        age < 18;

      // We still return the basic info of ALL patients (so the primary knows who is on the billing plan),
      // but we flag whether they are allowed to view the *clinical* data by clicking on them.
      return {
        ...patient,
        age: age,
        clinicalAccessAllowed: isVisibleToPrimary
      };
    });

    return NextResponse.json({ 
      success: true, 
      patients: visiblePatients
    });

  } catch (error: any) {
    console.error('Error fetching dependents:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch dependents' }, { status: 500 });
  }
}
