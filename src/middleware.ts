import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://airoessentials.com',
  'https://www.airoessentials.com',
  'https://airohealthhub.com',
  'https://www.airohealthhub.com',
  'https://airohealth-test.vercel.app',
  'https://airoone.in',
  'https://www.airoone.in',
  'http://localhost:3000',
  'http://localhost:3001',
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const origin = request.headers.get('origin');

  // 1. Host Header Injection Defense: Check against valid domain patterns
  const isAllowedHost =
    !host ||
    host.includes('airoessentials.com') ||
    host.includes('airohealthhub.com') ||
    host.includes('airoone.in') ||
    host.includes('vercel.app') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1');

  if (!isAllowedHost) {
    return new NextResponse('Invalid Host Header', { status: 400 });
  }

  // 2. CORS Preflight & Origin Handling for API Routes
  if (url.pathname.startsWith('/api')) {
    const isAllowedOrigin = origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app'));

    if (request.method === 'OPTIONS') {
      const preflightHeaders = new Headers();
      if (isAllowedOrigin && origin) {
        preflightHeaders.set('Access-Control-Allow-Origin', origin);
        preflightHeaders.set('Access-Control-Allow-Credentials', 'true');
      }
      preflightHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      preflightHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      preflightHeaders.set('Access-Control-Max-Age', '86400');
      return new NextResponse(null, { status: 204, headers: preflightHeaders });
    }
  }

  // Determine domains
  const isHealthDomain =
    host.includes('airohealth') ||
    host.includes('health.airo') ||
    host.includes('health.airoone') ||
    host.includes('localhost:3001');
  const isAdminDomain = host.startsWith('admin.');

  let response: NextResponse;

  // 3. Admin Subdomain Routing
  if (isAdminDomain && url.pathname === '/') {
    url.pathname = '/admin/dashboard';
    response = NextResponse.rewrite(url);
  } else if (isHealthDomain && url.pathname === '/') {
    // 4. Health Domain Routing
    url.pathname = '/health';
    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next();
  }

  // 5. Inject Security Headers on All Responses
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // 6. If request is to /api, set CORS and prevent caching
  if (url.pathname.startsWith('/api')) {
    if (origin && (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app'))) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    response.headers.set('Cache-Control', 'no-store, max-age=0, must-revalidate');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
