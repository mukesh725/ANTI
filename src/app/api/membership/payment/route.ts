import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, addDoc } from 'firebase/firestore';
import { razorpay } from '@/lib/razorpay';
import { verifyToken } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as { mobile: string } | null;
    
    if (!decoded || !decoded.mobile) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const usersRef = collection(db, 'users');
    const userSnapshot = await getDocs(query(usersRef, where('mobile', '==', decoded.mobile)));
    if (userSnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userDoc = userSnapshot.docs[0];
    const user = { id: userDoc.id, ...userDoc.data() } as any;

    const { planId } = await request.json();
    if (!planId) {
      return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });
    }

    const planRef = doc(db, 'membershipPlans', planId);
    const planSnapshot = await getDoc(planRef);
    if (!planSnapshot.exists()) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }
    const plan = planSnapshot.data();

    const amountInPaise = Math.round(plan.price * 100);

    let orderId = '';
    let amount = amountInPaise;
    let currency = 'INR';

    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy_key_id' || !process.env.RAZORPAY_KEY_ID) {
      orderId = `dummy_order_${Date.now()}`;
    } else {
      // Create Razorpay order
      const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}_${user.id.substring(0,5)}`
      };
      const order = await razorpay.orders.create(options);
      orderId = order.id;
      amount = order.amount as number;
      currency = order.currency;
    }

    // Create PaymentProviderStatus pending record in our DB
    const paymentRecordRef = await addDoc(collection(db, 'membershipPayments'), {
      userId: user.id,
      amount: plan.price,
      currency: 'INR',
      status: 'CREATED',
      razorpayOrderId: orderId,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      orderId: orderId,
      amount: amount,
      currency: currency,
      paymentRecordId: paymentRecordRef.id
    });
  } catch (error: any) {
    console.error('Payment Error:', error);
    return NextResponse.json({ error: error?.error?.description || error?.description || error?.message || 'Internal server error' }, { status: 500 });
  }
}
