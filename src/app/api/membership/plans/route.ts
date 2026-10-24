import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const plansRef = collection(db, 'membershipPlans');
    const snapshot = await getDocs(plansRef);
    
    let plans = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as any))
      .filter(plan => plan.status === 'ACTIVE')
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    if (!plans || plans.length === 0) {
      // Fallback to hardcoded plans if database is not seeded
      plans = [
        {
          id: 'plan_select',
          name: 'AIRO ONE™ Select',
          description: 'Only 1 Member Covered • For Individuals',
          price: 1999,
          quarterlyPrice: 590,
          durationDays: 365,
          features: JSON.stringify([
            '1 Member Covered',
            'Up to 60%+ Pharmacy Discount*',
            'Free Teleconsultation (MBBS / Specialists)',
            '2 Free In-Store Doctor Consultations/Yr',
            '4 AIRO Praana™ Health Screenings/Yr',
            'Free Medicine Delivery Above ₹1,500',
            'Quarterly Payment Option Available (₹590/qtr incl. GST)',
            'AIRO App & Digital Health Records',
            'In-Store Payment & Activation Only'
          ])
        },
        {
          id: 'plan_preferred',
          name: 'AIRO ONE™ Preferred',
          description: 'You + 1 (2 Members) • 1 Member Free Medication (350+ Meds)',
          price: 3999,
          quarterlyPrice: 1180,
          durationDays: 365,
          features: JSON.stringify([
            '2 Members Covered (You + 1)',
            '1 Member Free Medication (350+ Meds, Age 18+)',
            'Up to 60%+ Pharmacy Discount*',
            '3% AIRO Branded Products Discount',
            'Free Teleconsultation (MBBS / Specialists)',
            '6 Free In-Store Doctor Consultations/Yr',
            '10 AIRO Praana™ Health Screenings/Yr',
            '1 Annual Preventive Health Check-up/Yr',
            '2 Dietitian Consultations/Yr',
            '₹500 AIRO Medication Gift Voucher',
            'Quarterly Payment Option Available (₹1,180/qtr incl. GST)',
            'In-Store Payment & Activation Only'
          ])
        },
        {
          id: 'plan_signature',
          name: 'AIRO ONE™ Signature',
          description: 'You + 3 (4 Members) • 2 Members Free Medication • Care365™ & Ambulance',
          price: 6999,
          quarterlyPrice: 2065,
          durationDays: 365,
          features: JSON.stringify([
            '4 Members Covered (You + 3)',
            '2 Members Free Medication (350+ Meds, Age 18+)',
            'Up to 60%+ Pharmacy Discount*',
            '6% AIRO Branded Products Discount',
            'Free Teleconsultation (MBBS / Specialists)',
            '10 Free In-Store Doctor Consultations/Yr',
            'Unlimited AIRO Praana™ Health Screenings',
            '2 Annual Preventive Health Check-ups/Yr',
            '6 Dietitian Consultations/Yr',
            '₹1,000 AIRO Medication Gift Voucher',
            'AIRO Care365™ (24/7 Emergency Support) + Ambulance',
            'Quarterly Payment Option Available (₹2,065/qtr incl. GST)',
            'In-Store Payment & Activation Only'
          ])
        },
        {
          id: 'plan_infinite',
          name: 'AIRO ONE™ Infinite',
          description: 'You + 5 (6 Members) • 4 Members Free Medication • Care365™ & Ambulance',
          price: 8999,
          quarterlyPrice: 2655,
          durationDays: 365,
          features: JSON.stringify([
            '6 Members Covered (You + 5)',
            '4 Members Free Medication (350+ Meds, Age 18+)',
            'Up to 60%+ Pharmacy Discount*',
            '8% AIRO Branded Products Discount',
            'Free Teleconsultation (MBBS / Specialists)',
            '15 Free In-Store Doctor Consultations/Yr',
            'Unlimited AIRO Praana™ Health Screenings',
            '3 Annual Preventive Health Check-ups/Yr',
            '12 Dietitian Consultations/Yr',
            '₹1,500 AIRO Medication Gift Voucher',
            'AIRO Care365™ (24/7 Emergency Support) + Ambulance',
            'Quarterly Payment Option Available (₹2,655/qtr incl. GST)',
            'In-Store Payment & Activation Only'
          ])
        }
      ];
    }

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
