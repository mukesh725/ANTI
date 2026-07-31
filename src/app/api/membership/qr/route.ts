import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const data = searchParams.get('data');
    if (!data) return new NextResponse('Missing data parameter', { status: 400 });

    const buffer = await QRCode.toBuffer(data, {
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff00',
      },
      width: 240,
      type: 'png'
    });

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('QR generation error:', error);
    return new NextResponse('Error generating QR code', { status: 500 });
  }
}
