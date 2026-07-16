import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import QRCode from 'qrcode';
import { verifyToken } from '@/lib/membershipAuth';

// Helper to generate padded Membership ID
async function generateMembershipId() {
  // Simple transaction-safe approach: count existing and add 1
  // In highly concurrent production, use a sequence or auto-incrementing integer mapped to a string
  const count = await prisma.membership.count();
  const nextNumber = count + 1;
  return `AIRO${nextNumber.toString().padStart(9, '0')}`;
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
    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';
    const generated_signature = crypto.createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      await prisma.membershipPayment.update({
        where: { id: paymentRecordId },
        data: { status: 'FAILED' }
      });
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    // Check if membership already exists for this user to avoid duplicates
    const user = await prisma.user.findUnique({ where: { mobile: decoded.mobile } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const existingMembership = await prisma.membership.findFirst({ where: { userId: user.id } });
    if (existingMembership) {
      return NextResponse.json({ error: 'User already has a membership' }, { status: 400 });
    }

    const plan = await prisma.membershipPlan.findUnique({ where: { id: planId } });
    if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

    // Generate Membership ID
    const membershipId = await generateMembershipId();

    // Generate QR Code (Base64)
    const qrCodeDataUrl = await QRCode.toDataURL(membershipId);

    // Calculate Dates
    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    // Run in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Membership
      const newMembership = await tx.membership.create({
        data: {
          membershipId,
          userId: user.id,
          planId: plan.id,
          status: 'ACTIVE',
          startDate,
          expiryDate,
          qrCode: qrCodeDataUrl,
          barcode: membershipId // Barcode is often just the string representation rendered by frontend
        }
      });

      // 2. Update Payment Record
      await tx.membershipPayment.update({
        where: { id: paymentRecordId },
        data: {
          status: 'CAPTURED',
          razorpayPaymentId,
          paymentDate: new Date(),
          membershipId: newMembership.id
        }
      });

      // 3. Create Transaction Record
      await tx.membershipTransaction.create({
        data: {
          membershipId: newMembership.id,
          type: 'NEW',
          amount: plan.price,
          remarks: `New membership via Razorpay ${razorpay_payment_id}`
        }
      });

      return newMembership;
    });

    return NextResponse.json({ success: true, membership: result });
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
