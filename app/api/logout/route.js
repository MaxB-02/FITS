import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // Redirect to homepage on same origin as request
    const origin = new URL(request.url).origin;
    const response = NextResponse.redirect(new URL('/', origin));
    // Clear session cookie via platform API - multiple approaches to ensure it's cleared
    response.cookies.set('session', '', {
      maxAge: 0,
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Also try to clear with different attributes to ensure compatibility
    response.cookies.set({
      name: 'session',
      value: '',
      maxAge: 0,
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback: redirect to homepage even if cookie clearing fails
    const origin = new URL(request.url).origin;
    const res = NextResponse.redirect(new URL('/', origin));
    res.cookies.set('session', '', {
      maxAge: 0,
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    // Also try to clear with different attributes
    res.cookies.set({
      name: 'session',
      value: '',
      maxAge: 0,
      expires: new Date(0),
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    return res;
  }
}

// Also handle GET requests for backward compatibility
export async function GET(request) {
  return POST(request);
} 