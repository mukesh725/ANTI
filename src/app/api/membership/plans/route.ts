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
          description: '1 Member, ₹500 Welcome Coupons, Shopping Bag',
          price: 999,
          durationDays: 365,
          features: JSON.stringify(['1 Member Covered', '2% Essentials Discount', '15% Pharmacy Discount', '2 Free Doctor Consultations', '4 Basic Health Screenings'])
        },
        {
          id: 'plan_preferred',
          name: 'AIRO ONE™ Preferred',
          description: 'Up to 3 Members, ₹1500 Welcome Coupons, Wellness Kit',
          price: 2999,
          durationDays: 365,
          features: JSON.stringify(['Up to 3 Members Covered', '4% Essentials Discount', '18% Pharmacy Discount', '6 Free Doctor Consultations', '10 Basic Health Screenings'])
        },
        {
          id: 'plan_signature',
          name: 'AIRO ONE™ Signature',
          description: 'Up to 5 Members, ₹2500 Welcome Coupons, Premium Wellness Kit',
          price: 4999,
          durationDays: 365,
          features: JSON.stringify(['Up to 5 Members Covered', '6% Essentials Discount', '22% Pharmacy Discount', '10 Free Doctor Consultations', 'Unlimited Basic Health Screenings'])
        }
      ];
    }

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
