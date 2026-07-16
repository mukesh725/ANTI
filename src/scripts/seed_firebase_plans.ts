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
    description: '1 Member, ₹500 Welcome Coupons, Shopping Bag',
    price: 999,
    durationDays: 365,
    status: 'ACTIVE',
    features: JSON.stringify([
      '1 Member Covered',
      '2% Essentials Discount',
      '15% Pharmacy Discount',
      '2 Free Doctor Consultations/Yr',
      '4 Basic Health Screenings'
    ]),
    displayOrder: 1,
  },
  {
    id: "plan_preferred",
    name: 'AIRO ONE™ Preferred',
    description: 'Up to 3 Members, ₹1500 Welcome Coupons, Wellness Kit',
    price: 2999,
    durationDays: 365,
    status: 'ACTIVE',
    features: JSON.stringify([
      'Up to 3 Members Covered',
      '4% Essentials Discount',
      '18% Pharmacy Discount',
      '6 Free Doctor Consultations/Yr',
      '10 Basic Health Screenings'
    ]),
    displayOrder: 2,
  },
  {
    id: "plan_signature",
    name: 'AIRO ONE™ Signature',
    description: 'Up to 5 Members, ₹2500 Welcome Coupons, Premium Wellness Kit',
    price: 4999,
    durationDays: 365,
    status: 'ACTIVE',
    features: JSON.stringify([
      'Up to 5 Members Covered',
      '6% Essentials Discount',
      '22% Pharmacy Discount',
      '10 Free Doctor Consultations/Yr',
      'Unlimited Basic Health Screenings',
      'VIP Priority Service'
    ]),
    displayOrder: 3,
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
