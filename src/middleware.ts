import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Get hostname from headers. Next.js headers API gives the host with port (e.g. localhost:3000)
  const host = request.headers.get('host') || '';

  // Determine if it is the health domain. 
  // For local testing, we can use localhost:3001, or you can add airohealth to your hosts file.
  const isHealthDomain = host.includes('airohealth') || host.includes('health.airo') || host.includes('localhost:3001');

  // If we are on the Health domain and accessing the root path (/), rewrite to /health
  if (isHealthDomain && url.pathname === '/') {
    url.pathname = '/health';
    return NextResponse.rewrite(url);
  }

  // If we are on the Health domain, we should probably also block access to essentials pages,
  // but for now, we simply handle the routing and the GlobalHeader will handle the UI.
  // Optional: Redirect /grocery to / on health domain? Let's leave that for now.

  return NextResponse.next();
}

// Config to run middleware only on specific paths
export const config = {
  matcher: [
    // Apply to root
    '/',
    // We can also apply it to other pages if needed, but root is the main one to rewrite
  ],
};
