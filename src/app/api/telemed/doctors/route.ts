import { NextRequest, NextResponse } from 'next/server';
import { getEmedDoctors, matchDoctorsByService } from '@/lib/telemed';

export const dynamic = 'force-dynamic';

// In-memory sliding-window rate limiter (60 requests per minute per IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit = 60, windowMs = 60 * 1000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function GET(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    
    // 1. Rate Limiting Protection
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Please wait a moment.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const service = searchParams.get('service') || '';

    // 2. Fetch verified doctors
    const allDoctors = await getEmedDoctors();
    const filteredDoctors = service ? matchDoctorsByService(allDoctors, service) : allDoctors;

    // 3. Return sanitized response
    return NextResponse.json(
      {
        success: true,
        count: filteredDoctors.length,
        doctors: filteredDoctors,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
          'X-Content-Type-Options': 'nosniff',
        }
      }
    );
  } catch (error: any) {
    console.error('[API /api/telemed/doctors] Error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Failed to retrieve available telemed doctors.' },
      { status: 500 }
    );
  }
}
