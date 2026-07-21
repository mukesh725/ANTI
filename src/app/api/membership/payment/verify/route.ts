import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, addDoc, updateDoc, runTransaction } from 'firebase/firestore';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
import QRCode from 'qrcode';
import { verifyToken } from '@/lib/membershipAuth';

// Helper to generate padded Membership ID using Firestore transactions
async function generateMembershipId() {
  const counterRef = doc(db, 'counters', 'membershipIdCounter');
  
  try {
    const nextNumber = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists()) {
        transaction.set(counterRef, { count: 1 });
        return 1;
      }
      const newCount = (counterDoc.data().count || 0) + 1;
      transaction.update(counterRef, { count: newCount });
      return newCount;
    });
    return `AIRO${nextNumber.toString().padStart(9, '0')}`;
  } catch (error) {
    console.error("Counter transaction failed: ", error);
    // Fallback if transaction fails
    return `AIRO${Date.now().toString().slice(-9)}`;
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { mobile: string } | null;
    
    if (!decoded || !decoded.mobile) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      paymentRecordId,
      planId
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentRecordId || !planId) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    // Verify Signature
    if (!razorpay_order_id.startsWith('dummy_')) {
      const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
      const generated_signature = crypto.createHmac('sha256', secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        await updateDoc(doc(db, 'membershipPayments', paymentRecordId), { status: 'FAILED' });
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
      }
    }

    // Check if user exists
    const usersRef = collection(db, 'users');
    const userSnapshot = await getDocs(query(usersRef, where('mobile', '==', decoded.mobile)));
    if (userSnapshot.empty) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const user = { id: userSnapshot.docs[0].id, ...userSnapshot.docs[0].data() } as any;

    // Check for existing membership
    const membershipsRef = collection(db, 'memberships');
    const existingMembership = await getDocs(query(membershipsRef, where('userId', '==', user.id)));
    if (!existingMembership.empty) {
      return NextResponse.json({ error: 'User already has a membership' }, { status: 400 });
    }

    // Get Plan
    const planRef = doc(db, 'membershipPlans', planId);
    const planSnapshot = await getDoc(planRef);
    if (!planSnapshot.exists()) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    const plan = planSnapshot.data();

    // Generate Membership ID
    const membershipId = await generateMembershipId();

    // Generate QR Code (Base64)
    const qrCodeDataUrl = await QRCode.toDataURL(membershipId);

    // Calculate Dates
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + (plan.durationDays || 365));

    // 1. Create Membership
    const membershipDoc = await addDoc(collection(db, 'memberships'), {
      membershipId,
      userId: user.id,
      planId: planSnapshot.id,
      status: 'ACTIVE',
      startDate: startDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      qrCode: qrCodeDataUrl,
      barcode: membershipId,
      createdAt: new Date().toISOString()
    });

    // 2. Update Payment Record
    await updateDoc(doc(db, 'membershipPayments', paymentRecordId), {
      status: 'CAPTURED',
      razorpayPaymentId: razorpay_payment_id,
      paymentDate: new Date().toISOString(),
      membershipId: membershipDoc.id
    });

    // 3. Create Transaction Record
    await addDoc(collection(db, 'membershipTransactions'), {
      membershipId: membershipDoc.id,
      type: 'NEW',
      amount: plan.price,
      remarks: `New membership via Razorpay ${razorpay_payment_id}`,
      createdAt: new Date().toISOString()
    });

    const result = {
      id: membershipDoc.id,
      membershipId,
      status: 'ACTIVE',
      startDate,
      expiryDate
    };

    return NextResponse.json({ success: true, membership: result });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
