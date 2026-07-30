import { NextResponse } from 'next/server';
import { getAllMembers } from '@/lib/membershipRepository';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const members = await getAllMembers();

    // Transform members to requested exact columns:
    // Member ID | Name | Mobile | Email | Plan | Payment Status | Membership Status | Activation Date | Expiry Date
    const excelData = members.map((m) => {
      const formatDate = (isoStr: string | null) => {
        if (!isoStr) return 'N/A';
        try {
          return new Date(isoStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        } catch (e) {
          return isoStr;
        }
      };

      return {
        'Member ID': m.memberId || 'N/A (Pending)',
        'Registration ID': m.registrationId || '',
        'Name': `${m.firstName} ${m.lastName}`.trim(),
        'Mobile': m.mobile || '',
        'Email': m.email || '',
        'Plan': m.membershipPlan || '',
        'Payment Status': m.paymentStatus || '',
        'Payment Method': m.paymentMethod || 'N/A',
        'Membership Status': m.membershipStatus || '',
        'Activation Date': formatDate(m.activationDate),
        'Expiry Date': formatDate(m.expiryDate),
        'Registration Date': formatDate(m.registrationDate),
      };
    });

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Auto-size column widths
    const colWidths = [
      { wch: 16 }, // Member ID
      { wch: 18 }, // Registration ID
      { wch: 24 }, // Name
      { wch: 16 }, // Mobile
      { wch: 28 }, // Email
      { wch: 20 }, // Plan
      { wch: 16 }, // Payment Status
      { wch: 16 }, // Payment Method
      { wch: 20 }, // Membership Status
      { wch: 16 }, // Activation Date
      { wch: 16 }, // Expiry Date
      { wch: 16 }, // Registration Date
    ];
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AIRO ONE Members');

    // Generate buffer
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const filename = `AIRO_ONE_Members_${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Excel Export Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to export members to Excel' },
      { status: 500 }
    );
  }
}
