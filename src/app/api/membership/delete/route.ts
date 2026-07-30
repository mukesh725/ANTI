import { NextResponse } from 'next/server';
import { deleteMember } from '@/lib/membershipRepository';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('docId');

    if (!docId) {
      return NextResponse.json({ success: false, error: 'Missing docId parameter' }, { status: 400 });
    }

    await deleteMember(docId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in Delete API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete member' },
      { status: 500 }
    );
  }
}
