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
    description: 'Only One Member Covered • For Individuals',
    price: 1999,
    quarterlyPrice: 590,
    durationDays: 365,
    status: 'ACTIVE',
    features: JSON.stringify([
      'Only 1 Member Covered',
      'Up to 60%+ Pharmacy Discount*',
      '3 Free In-Store Doctor Consultations/Yr',
      '3 Free Telemedicine Consultations/Yr',
      '4 AIRO Praana™ Health Screenings/Yr',
      'Free Medicine Delivery Above ₹1,000',
      'AIRO App & Digital Health Records',
      'Health & Medication Reminders',
      'Senior Citizens Care (60+ Years)'
    ]),
    displayOrder: 1,
  },
  {
    id: "plan_preferred",
    name: 'AIRO ONE™ Preferred',
    description: 'You + 1 Member Covered • 1 Member Free Medication (350+ Essential Meds)',
    price: 3999,
    quarterlyPrice: 1180,
    durationDays: 365,
    status: 'ACTIVE',
    features: JSON.stringify([
      'You + 1 Member Covered',
      'Up to 60%+ Pharmacy Discount*',
      'Free Medication for 1 Member (350+ Essential Medicines)',
      '6 Free In-Store Doctor Consultations/Yr',
      '6 Free Telemedicine Consultations/Yr',
      '10 AIRO Praana™ Health Screenings/Yr',
      '1 Annual Preventive Health Check-up/Yr',
      '3 Dietitian Consultations/Yr',
      'Free Medicine Delivery Above ₹1,000',
      'AIRO App & Digital Health Records',
      'Health & Medication Reminders',
      'Senior Citizens Care (60+ Years)'
    ]),
    displayOrder: 2,
  },
  {
    id: "plan_signature",
    name: 'AIRO ONE™ Signature',
    description: 'You + 3 Members Covered • 2 Members Free Medication • Care365™ & Ambulance',
    price: 6999,
    quarterlyPrice: 2065,
    durationDays: 365,
    status: 'ACTIVE',
    features: JSON.stringify([
      'You + 3 Members Covered',
      'Up to 60%+ Pharmacy Discount*',
      'Free Medication for 2 Members (350+ Essential Medicines)',
      '10 Free In-Store Doctor Consultations/Yr',
      '10 Free Telemedicine Consultations/Yr',
      'Unlimited AIRO Praana™ Health Screenings',
      '2 Annual Preventive Health Check-ups/Yr',
      '6 Dietitian Consultations/Yr',
      'Unlimited Free Medicine Delivery',
      'Ambulance Assistance Included',
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
    description: 'You + 5 Members Covered • 4 Members Free Medication • Care365™ & Ambulance',
    price: 8999,
    quarterlyPrice: 2655,
    durationDays: 365,
    status: 'ACTIVE',
    features: JSON.stringify([
      'You + 5 Members Covered',
      'Up to 60%+ Pharmacy Discount*',
      'Free Medication for 4 Members (350+ Essential Medicines)',
      '12 Free In-Store Doctor Consultations/Yr',
      'Unlimited Free Telemedicine Consultations',
      'Unlimited AIRO Praana™ Health Screenings',
      '4 Annual Preventive Health Check-ups/Yr',
      '10 Dietitian Consultations/Yr',
      'Unlimited Free Medicine Delivery',
      'Ambulance Assistance Included',
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
