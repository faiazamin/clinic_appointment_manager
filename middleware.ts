import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const clinicId = request.headers.get('x-clinic-id');

  if (!clinicId) {
    // For API routes, return a JSON error
    if (request.nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Clinic ID (x-clinic-id header) is required' }, { status: 400 });
    }
    // For page routes, redirect to a generic error page or login with clinic selection
    // For now, we'll just show a simple error message
    return new NextResponse('<h1>Clinic ID (x-clinic-id header) is required</h1>', { status: 400, headers: { 'content-type': 'text/html' } });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/patients',
    '/appointments',
    '/api/patients/:path*',
    '/api/appointments/:path*',
    '/api/clinics/:path*',
  ],
};
