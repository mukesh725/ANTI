import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: "AIzaSyDnETde8uzn-J2uQtsEIaplaAnxM-rcbz8",
  authDomain: "airo-essentials-and-health.firebaseapp.com",
  projectId: "airo-essentials-and-health",
  storageBucket: "airo-essentials-and-health.firebasestorage.app",
  messagingSenderId: "1081516241235",
  appId: "1:1081516241235:web:325f6852c795a30035b1a6",
  measurementId: "G-VJYRPK5MYR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const plans = [
  {
    id: "plan_select",
    name: 'AIRO ONE™ Select',
    description: '1 Member Covered • For Individuals',
    price: 999,
    durationDays: 365,
    status: 'ACTIVE',
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
    ]),
    displayOrder: 1,
  },
  {
    id: "plan_preferred",
    name: 'AIRO ONE™ Preferred',
    description: 'Up to 3 Members • For Small Families • ₹500 Medication Voucher',
    price: 2999,
    durationDays: 365,
    status: 'ACTIVE',
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
    ]),
    displayOrder: 2,
  },
  {
    id: "plan_signature",
    name: 'AIRO ONE™ Signature',
    description: 'Up to 5 Members • For Families • ₹1,000 Medication Voucher • AIRO Care365™',
    price: 6999,
    durationDays: 365,
    status: 'ACTIVE',
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
    ]),
    displayOrder: 3,
  },
  {
    id: "plan_infinite",
    name: 'AIRO ONE™ Infinite',
    description: 'Up to 6 Members • For Large Families • ₹1,500 Medication Voucher • AIRO Care365™',
    price: 8999,
    durationDays: 365,
    status: 'ACTIVE',
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
    ]),
    displayOrder: 4,
  }
];

async function seedPlans() {
  console.log("Seeding AIRO ONE Membership Plans to Firebase...");
  for (const plan of plans) {
    try {
      const planRef = doc(db, 'membershipPlans', plan.id);
      const { id, ...planData } = plan; 
      await setDoc(planRef, planData);
      console.log(`✅ Seeded: ${plan.name}`);
    } catch (error) {
      console.error(`❌ Error seeding ${plan.name}:`, error);
    }
  }
  console.log("Done seeding!");
  process.exit(0);
}

seedPlans();
