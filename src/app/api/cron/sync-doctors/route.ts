import { NextRequest, NextResponse } from 'next/server';
import { syncEmedDoctorsFromUpstream } from '@/lib/telemed';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const doctors = await syncEmedDoctorsFromUpstream();
    return NextResponse.json({
      success: true,
      message: 'AIRO E-Med doctors successfully synchronized to Firestore and cache.',
      count: doctors.length,
      timestamp: new Date().toISOString(),
      doctors: doctors.map(d => ({
        id: d.id,
        name: d.name,
        specialization: d.specialization,
        degree: d.degree,
        experienceYears: d.experienceYears,
        consultationFee: d.consultationFee,
        hasPhoto: Boolean(d.profileImage),
      })),
    });
  } catch (error: any) {
    console.error('[API /api/cron/sync-doctors] Error syncing doctors:', error);
    return NextResponse.json(
      { error: 'SYNC_FAILED', message: error.message || 'Failed to sync doctors' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
