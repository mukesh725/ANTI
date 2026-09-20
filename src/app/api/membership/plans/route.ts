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
          description: '1 Member Covered • For Individuals',
          price: 999,
          durationDays: 365,
          features: JSON.stringify([
            '1 Member Covered',
            'Up to 60%+ Pharmacy Discount*',
            '2 Free In-Store Doctor Consultations/Yr',
            '2 Free Telemedicine Consultations/Yr',
            '4 AIRO Praana™ Health Screenings/Yr',
            'Free Medicine Delivery Above ₹1,500',
            'AIRO App & Digital Health Records',
            'Health & Medication Reminders',
            'Senior Citizens Care (60+ Years)'
          ])
        },
        {
          id: 'plan_preferred',
          name: 'AIRO ONE™ Preferred',
          description: 'Up to 3 Members • For Small Families • ₹500 Medication Voucher',
          price: 2999,
          durationDays: 365,
          features: JSON.stringify([
            'Up to 3 Members Covered',
            'Up to 60%+ Pharmacy Discount*',
            '3% AIRO Branded Products Discount',
            '6 Free In-Store Doctor Consultations/Yr',
            '6 Free Telemedicine Consultations/Yr',
            '10 AIRO Praana™ Health Screenings/Yr',
            '1 Annual Preventive Health Check-up/Yr',
            '2 Dietitian Consultations/Yr',
            '₹500 AIRO Medication Gift Voucher',
            'Free Medicine Delivery Above ₹1,500',
            'AIRO App & Digital Health Records',
            'Health & Medication Reminders',
            'Senior Citizens Care (60+ Years)'
          ])
        },
        {
          id: 'plan_signature',
          name: 'AIRO ONE™ Signature',
          description: 'Up to 5 Members • For Families • ₹1,000 Medication Voucher • AIRO Care365™',
          price: 6999,
          durationDays: 365,
          features: JSON.stringify([
            'Up to 5 Members Covered',
            'Up to 60%+ Pharmacy Discount*',
            '6% AIRO Branded Products Discount',
            '10 Free In-Store Doctor Consultations/Yr',
            '10 Free Telemedicine Consultations/Yr',
            'Unlimited AIRO Praana™ Health Screenings',
            '2 Annual Preventive Health Check-ups/Yr',
            '6 Dietitian Consultations/Yr',
            '₹1,000 AIRO Medication Gift Voucher',
            'Unlimited Free Medicine Delivery',
            'AIRO Care365™ (24/7 Emergency Support)',
            'AIRO App & Digital Health Records',
            'Health & Medication Reminders',
            'Senior Citizens Care (60+ Years)'
          ])
        },
        {
          id: 'plan_infinite',
          name: 'AIRO ONE™ Infinite',
          description: 'Up to 6 Members • For Large Families • ₹1,500 Medication Voucher • AIRO Care365™',
          price: 8999,
          durationDays: 365,
          features: JSON.stringify([
            'Up to 6 Members Covered',
            'Up to 60%+ Pharmacy Discount*',
            '8% AIRO Branded Products Discount',
            '15 Free In-Store Doctor Consultations/Yr',
            'Unlimited Free Telemedicine Consultations',
            'Unlimited AIRO Praana™ Health Screenings',
            '3 Annual Preventive Health Check-ups/Yr',
            '12 Dietitian Consultations/Yr',
            '₹1,500 AIRO Medication Gift Voucher',
            'Unlimited Free Medicine Delivery',
            'AIRO Care365™ (24/7 Emergency Support)',
            'AIRO App & Digital Health Records',
            'Health & Medication Reminders',
            'Senior Citizens Care (60+ Years)'
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
