import { NextResponse } from 'next/server';
import { updateMember, getMemberById } from '@/lib/membershipRepository';
import { generateDigitalMembershipCard } from '@/lib/membershipCardGenerator';
import { verifyAdminAuth } from '@/lib/membershipAuth';

export const dynamic = 'force-dynamic';

const ALLOWED_MEMBER_UPDATE_FIELDS = new Set([
  'firstName',
  'lastName',
  'mobile',
  'email',
  'address',
  'city',
  'pincode',
  'dob',
  'gender',
  'emergencyContact',
  'membershipPlan',
  'paymentStatus',
  'paymentMethod',
  'membershipStatus'
]);

const VALID_MEMBERSHIP_STATUSES = new Set([
  'Active',
  'Pending Activation',
  'Expired',
  'Cancelled'
]);

const VALID_PAYMENT_STATUSES = new Set([
  'Paid',
  'Pending',
  'Failed',
  'Refunded'
]);

export async function PUT(request: Request) {
  try {
    const admin = verifyAdminAuth(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Valid administrative credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { docId, updates } = body;

    if (!docId || !updates || typeof updates !== 'object') {
      return NextResponse.json({ success: false, error: 'Missing docId or valid updates payload' }, { status: 400 });
    }

    // Mass assignment defense: Filter against allowlisted fields only
    const safeUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (ALLOWED_MEMBER_UPDATE_FIELDS.has(key)) {
        if (key === 'membershipStatus') {
          if (VALID_MEMBERSHIP_STATUSES.has(value as string)) {
            safeUpdates[key] = value;
          }
        } else if (key === 'paymentStatus') {
          if (VALID_PAYMENT_STATUSES.has(value as string)) {
            safeUpdates[key] = value;
          }
        } else {
          safeUpdates[key] = value;
        }
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json({ success: false, error: 'No valid update fields provided' }, { status: 400 });
    }

    // Call update with filtered updates
    await updateMember(docId, safeUpdates);

    // After updating, check if name, plan, or status changed which requires regenerating the digital card
    if (safeUpdates.firstName || safeUpdates.lastName || safeUpdates.membershipPlan || safeUpdates.membershipStatus) {
      try {
        const updatedMember = await getMemberById(docId);
        if (updatedMember && updatedMember.membershipStatus === 'Active' && updatedMember.memberId) {
          const cardUrl = await generateDigitalMembershipCard({
            memberId: updatedMember.memberId,
            firstName: updatedMember.firstName,
            lastName: updatedMember.lastName,
            membershipPlan: updatedMember.membershipPlan,
            expiryDate: updatedMember.expiryDate || new Date().toISOString()
          });

          // Save new card
          await updateMember(docId, { digitalCardUrl: cardUrl });
        }
      } catch (cardErr) {
        console.warn('Non-fatal: card regeneration skipped during edit:', cardErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in Edit API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update member record' },
      { status: 500 }
    );
  }
}
