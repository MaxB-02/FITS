import { NextResponse } from 'next/server';
import { requireAdminEdge } from './lib/auth-simple.js';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Allow login routes but NOT logout routes (logout should require auth)
    if (pathname === '/login' || pathname === '/api/login') {
      return NextResponse.next();
    }
    
    // Check authentication
    return requireAdminEdge(request).then(user => {
      if (!user) {
        // Redirect to login for page requests
        if (pathname.startsWith('/admin')) {
          const url = new URL('/login', request.url);
          url.searchParams.set('error', 'AccessDenied');
          return NextResponse.redirect(url);
        }
        
        // Return 401 for API requests
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized' }),
          { 
            status: 401, 
            headers: { 'Content-Type': 'application/json' } 
          }
        );
      }
      
      return NextResponse.next();
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
}; 