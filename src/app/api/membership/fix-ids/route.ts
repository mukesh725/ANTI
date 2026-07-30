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
    const results: string[] = [];

    // Find the one with AHR-ESN-6161 (chinnunaik227)
    const chinnuDoc = memSnapshot.docs.find(d => (d.data() as MemberRecord).email === 'chinnunaik227@gmail.com');
    if (chinnuDoc) {
      const member = chinnuDoc.data() as MemberRecord;
      member.id = chinnuDoc.id;
      member.memberId = 'AIRO-1000001';
      member.membershipStatus = 'Active';
      const digitalCardUrl = await generateDigitalMembershipCard(member);
      await updateDoc(doc(db, 'Members', member.id), {
        memberId: 'AIRO-1000001',
        membershipStatus: 'Active',
        digitalCardUrl
      });
      results.push(`Updated chinnunaik227 to AIRO-1000001`);
      updatedCount++;
    }

    // Find the pending one (harikanaik2799)
    const harikaDoc = memSnapshot.docs.find(d => (d.data() as MemberRecord).email === 'harikanaik2799@gmail.com');
    if (harikaDoc) {
      const member = harikaDoc.data() as MemberRecord;
      member.id = harikaDoc.id;
      member.memberId = 'AIRO-1000003';
      member.membershipStatus = 'Active';
      const digitalCardUrl = await generateDigitalMembershipCard(member);
      await updateDoc(doc(db, 'Members', member.id), {
        memberId: 'AIRO-1000003',
        membershipStatus: 'Active',
        digitalCardUrl
      });
      results.push(`Updated harikanaik2799 to AIRO-1000003`);
      updatedCount++;
    }

    // Regenerate others just in case (e.g. nrruthin)
    for (const d of memSnapshot.docs) {
      const email = (d.data() as MemberRecord).email;
      if (email !== 'chinnunaik227@gmail.com' && email !== 'harikanaik2799@gmail.com') {
        const member = d.data() as MemberRecord;
        member.id = d.id;
        if (member.memberId) {
          const digitalCardUrl = await generateDigitalMembershipCard(member);
          await updateDoc(doc(db, 'Members', member.id), { digitalCardUrl });
          results.push(`Regenerated ${email} (${member.memberId})`);
          updatedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      results
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
