import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  deleteDoc 
} from 'firebase/firestore';
import { PraanaVitalRecord } from '@/types/praana';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');
    const accountId = searchParams.get('accountId');
    const phone = searchParams.get('phone');
    const maxLimit = parseInt(searchParams.get('limit') || '50', 10);

    const vitalsRef = collection(db, 'praana_vitals');
    let q;

    if (patientId) {
      q = query(vitalsRef, where('patientId', '==', patientId));
    } else if (accountId) {
      q = query(vitalsRef, where('accountId', '==', accountId));
    } else if (phone) {
      q = query(vitalsRef, where('patientPhone', '==', phone));
    } else {
      q = query(vitalsRef);
    }

    const snap = await getDocs(q);
    const vitals: PraanaVitalRecord[] = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<PraanaVitalRecord, 'id'>),
    }));

    // Sort in-memory descending by timestamp
    vitals.sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());

    return NextResponse.json({
      success: true,
      count: vitals.length,
      vitals: vitals.slice(0, maxLimit),
    });
  } catch (error: any) {
    console.error('Error fetching Praana vitals:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch vitals' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.patientId || !body.patientName) {
      return NextResponse.json(
        { error: 'Missing required patient information (patientId, patientName)' },
        { status: 400 }
      );
    }

    const sessionId = body.sessionId || `PRN-SESS-${Date.now()}`;
    const timestamp = body.timestamp || new Date().toISOString();

    const record: PraanaVitalRecord = {
      id: sessionId,
      sessionId,
      patientId: body.patientId,
      accountId: body.accountId || body.patientPhone || body.patientId,
      patientName: body.patientName,
      patientPhone: body.patientPhone || '',
      patientEmail: body.patientEmail || '',
      timestamp,

      respiratoryRate: Number(body.respiratoryRate ?? 16),
      spo2: Number(body.spo2 ?? 98),
      bloodPressureSystolic: Number(body.bloodPressureSystolic ?? 120),
      bloodPressureDiastolic: Number(body.bloodPressureDiastolic ?? 80),
      heartRate: Number(body.heartRate ?? 72),
      pulseRate: Number(body.pulseRate ?? body.heartRate ?? 72),
      weightLbs: Number(body.weightLbs ?? 150),
      temperatureF: Number(body.temperatureF ?? 98.6),
      ecgStatus: body.ecgStatus || 'Normal Sinus Rhythm',
      chairSignalQuality: Number(body.chairSignalQuality ?? 0.99),
      stressScore: body.stressScore ? Number(body.stressScore) : 25,
      notes: body.notes || '',
      recordedBy: body.recordedBy || 'Admin Clinical Station',
      createdAt: new Date().toISOString(),
    };

    const docRef = doc(db, 'praana_vitals', sessionId);
    await setDoc(docRef, record);

    return NextResponse.json({
      success: true,
      message: 'Praana vitals recorded successfully',
      record,
    });
  } catch (error: any) {
    console.error('Error saving Praana vitals:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to save vitals' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing record ID' }, { status: 400 });
    }

    const docRef = doc(db, 'praana_vitals', id);
    await deleteDoc(docRef);

    return NextResponse.json({
      success: true,
      message: 'Vital record deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting vital record:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete record' },
      { status: 500 }
    );
  }
}
