import { NextResponse } from 'next/server';
import { updateMember, getMemberById } from '@/lib/membershipRepository';
import { generateDigitalMembershipCard } from '@/lib/membershipCardGenerator';
import { MemberRecord } from '@/types/membership';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { docId, updates } = body;

    if (!docId || !updates) {
      return NextResponse.json({ success: false, error: 'Missing docId or updates' }, { status: 400 });
    }

    // Call update first
    await updateMember(docId, updates);

    // After updating, check if name or plan changed which requires regenerating the digital card
    if (updates.firstName || updates.lastName || updates.membershipPlan) {
      // Get the full member record
      const updatedMember = await getMemberById(docId);
      if (updatedMember && updatedMember.membershipStatus === 'Active' && updatedMember.memberId) {
        // Regenerate card
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
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in Edit API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update member' },
      { status: 500 }
    );
  }
}
