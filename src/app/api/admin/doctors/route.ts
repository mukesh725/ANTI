import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { verifyAdminAuth } from '@/lib/membershipAuth';
import { hashPassword, validatePasswordStrength } from '@/lib/password';

export const dynamic = 'force-dynamic';

const ALLOWED_DOCTOR_UPDATE_FIELDS = new Set([
  'name', 'degree', 'registrationNumber', 'registrationExpiryDate',
  'experienceYears', 'email', 'phone', 'password', 'specialty',
  'clinicName', 'city', 'bio', 'profilePhotoUrl', 'digitalSignatureUrl',
  'isFeatured', 'status', 'consultationFee', 'categories', 'supportingDocuments'
]);

export async function GET(req: NextRequest) {
  try {
    const admin = verifyAdminAuth(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Valid administrative credentials required.' },
        { status: 401 }
      );
    }

    const doctorsRef = collection(db, 'doctors');
    const snapshot = await getDocs(doctorsRef);

    const doctors = snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      // Mask raw password in admin response for security
      const { password, ...safeData } = data;
      return {
        id: docSnap.id,
        hasCustomPassword: Boolean(password),
        ...safeData
      };
    });

    return NextResponse.json({
      success: true,
      count: doctors.length,
      doctors
    });
  } catch (error: any) {
    console.error('[API /api/admin/doctors] GET error:', error);
    return NextResponse.json(
      { error: 'FETCH_FAILED', message: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminAuth(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Valid administrative credentials required.' },
        { status: 401 }
      );
    }

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

    // Password strength check (Point 19)
    const rawPassword = password || 'DoctorSecure2026!';
    const strength = validatePasswordStrength(rawPassword);
    if (!strength.valid) {
      return NextResponse.json(
        { error: 'WEAK_PASSWORD', message: strength.reason },
        { status: 400 }
      );
    }

    // Generate unique ID
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
    const doctorDocId = `doc_${cleanName}_${Date.now().toString(36)}`;
    const doctorNumId = Date.now() % 100000;

    // Cryptographic Password Hashing (Point 9)
    const hashedPassword = hashPassword(rawPassword);

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
      password: hashedPassword,
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

    const { password: _, ...safeReturnRecord } = newDoctorRecord;

    return NextResponse.json({
      success: true,
      message: 'Doctor added successfully with encrypted credentials.',
      doctor: safeReturnRecord
    });
  } catch (error: any) {
    console.error('[API /api/admin/doctors] POST error:', error);
    return NextResponse.json(
      { error: 'CREATE_FAILED', message: 'Failed to create doctor' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = verifyAdminAuth(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Valid administrative credentials required.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { id, ...updateFields } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'VALIDATION_ERROR', message: 'Doctor ID is required.' },
        { status: 400 }
      );
    }

    // Mass assignment defense (Point 15): Filter against allowlisted fields only
    const safeUpdates: Record<string, any> = {};
    for (const [key, value] of Object.entries(updateFields)) {
      if (ALLOWED_DOCTOR_UPDATE_FIELDS.has(key)) {
        if (key === 'password' && typeof value === 'string' && value.trim()) {
          const strength = validatePasswordStrength(value);
          if (!strength.valid) {
            return NextResponse.json(
              { error: 'WEAK_PASSWORD', message: strength.reason },
              { status: 400 }
            );
          }
          safeUpdates.password = hashPassword(value);
        } else {
          safeUpdates[key] = value;
        }
      }
    }

    safeUpdates.updatedAt = new Date().toISOString();

    const docRef = doc(db, 'doctors', id);
    await updateDoc(docRef, safeUpdates);

    return NextResponse.json({
      success: true,
      message: 'Doctor updated successfully.',
    });
  } catch (error: any) {
    console.error('[API /api/admin/doctors] PATCH error:', error);
    return NextResponse.json(
      { error: 'UPDATE_FAILED', message: 'Failed to update doctor' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = verifyAdminAuth(req);
    if (!admin) {
      return NextResponse.json(
        { error: 'UNAUTHORIZED', message: 'Valid administrative credentials required.' },
        { status: 401 }
      );
    }

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
