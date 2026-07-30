import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { generateDigitalMembershipCard } from '@/lib/membershipCardGenerator';
import { MemberRecord } from '@/types/membership';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const memSnapshot = await getDocs(collection(db, 'Members'));
    
    let updatedCount = 0;
    const errors: string[] = [];

    for (const d of memSnapshot.docs) {
      try {
        const member = d.data() as MemberRecord;
        member.id = d.id;
        
        // Only regenerate for members who have a generated memberId
        if (member.memberId) {
          const digitalCardUrl = await generateDigitalMembershipCard(member);
          await updateDoc(doc(db, 'Members', member.id), {
            digitalCardUrl
          });
          updatedCount++;
        }
      } catch (err: any) {
        errors.push(`Error updating ${d.id}: ${err.message}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Regenerated ${updatedCount} membership cards with new design`,
      updatedCount,
      errors
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
