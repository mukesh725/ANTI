import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (!ref) {
      return new NextResponse('Missing ref parameter', { status: 400 });
    }

    // Generate QR code as a PNG buffer
    const buffer = await QRCode.toBuffer(ref, {
      type: 'png',
      width: 300,
      margin: 2,
      color: {
        dark: '#1C1C1E',
        light: '#FFFFFF'
      }
    });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable'
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return new NextResponse('Error generating QR code', { status: 500 });
  }
}
