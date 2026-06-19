import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Get hostname from headers. Next.js headers API gives the host with port (e.g. localhost:3000)
  const host = request.headers.get('host') || '';

  // Determine domains
  const isHealthDomain = host.includes('airohealth') || host.includes('health.airo') || host.includes('localhost:3001');
  const isAdminDomain = host.startsWith('admin.');

  // 1. Admin Subdomain Routing
  // Rewrite admin.domain.com/ to /admin/dashboard
  if (isAdminDomain && url.pathname === '/') {
    url.pathname = '/admin/dashboard';
    return NextResponse.rewrite(url);
  }

  // 2. Health Domain Routing
  // Rewrite health domain root to /health
  if (isHealthDomain && url.pathname === '/') {
    url.pathname = '/health';
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

// Config to run middleware only on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
