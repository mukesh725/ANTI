import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const doctorsRef = collection(db, 'doctors');
    const snapshot = await getDocs(doctorsRef);

    const doctors = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    return NextResponse.json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error: any) {
    console.error('[API /api/admin/doctors] GET error:', error);
    return NextResponse.json(
      { error: 'FETCH_FAILED', message: error.message || 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      degree,
      registrationNumber,
      registrationExpiryDate,
      experienceYears,
      email,
      phone,
      password,
      specialty,
      clinicName,
      city,
      bio,
      profilePhotoUrl,
      digitalSignatureUrl,
      isFeatured,
      status,
      consultationFee,
      categories,
      supportingDocuments
    } = body;

    if (!name || !degree || !registrationNumber || !email || !phone || !specialty) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Name, degree, registration number, email, phone, and specialty are required.' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
    const doctorDocId = `doc_${cleanName}_${Date.now().toString(36)}`;
    const doctorNumId = Date.now() % 100000;

    const newDoctorRecord = {
      id: doctorDocId,
      doctorId: String(doctorNumId),
      name: name.trim().startsWith('Dr') ? name.trim() : `Dr. ${name.trim()}`,
      degree: degree.trim(),
      registrationNumber: registrationNumber.trim(),
      registrationExpiryDate: registrationExpiryDate || null,
      experienceYears: Number(experienceYears) || 0,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password: password || 'doctor123',
      specialty: specialty.trim(),
      clinicName: clinicName?.trim() || 'AIRO Health Hub',
      city: city?.trim() || 'Hyderabad',
      bio: bio?.trim() || '',
      profilePhotoUrl: profilePhotoUrl || null,
      digitalSignatureUrl: digitalSignatureUrl || null,
      isFeatured: Boolean(isFeatured),
      status: status === 'inactive' ? 'inactive' : 'active',
      consultationFee: Number(consultationFee) || 499,
      categories: Array.isArray(categories) && categories.length > 0 ? categories : [specialty.trim()],
      supportingDocuments: Array.isArray(supportingDocuments) ? supportingDocuments : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = doc(db, 'doctors', doctorDocId);
    await setDoc(docRef, newDoctorRecord);

    return NextResponse.json({
      success: true,
      message: 'Doctor added successfully with dedicated portal credentials.',
      doctor: newDoctorRecord
    });
  } catch (error: any) {
    console.error('[API /api/admin/doctors] POST error:', error);
    return NextResponse.json(
      { error: 'CREATE_FAILED', message: error.message || 'Failed to create doctor' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Doctor ID is required.' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'doctors', id);
    const updatePayload = {
      ...updateFields,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(docRef, updatePayload);

    return NextResponse.json({
      success: true,
      message: 'Doctor updated successfully.',
      updatedFields: updatePayload
    });
  } catch (error: any) {
    console.error('[API /api/admin/doctors] PATCH error:', error);
    return NextResponse.json(
      { error: 'UPDATE_FAILED', message: error.message || 'Failed to update doctor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Doctor ID is required.' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'doctors', id);
    await deleteDoc(docRef);

    return NextResponse.json({
      success: true,
      message: 'Doctor removed successfully.'
    });
  } catch (error: any) {
    console.error('[API /api/admin/doctors] DELETE error:', error);
    return NextResponse.json(
      { error: 'DELETE_FAILED', message: error.message || 'Failed to delete doctor' },
      { status: 500 }
    );
  }
}
