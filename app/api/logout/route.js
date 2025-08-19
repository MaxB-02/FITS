import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // Redirect to homepage on same origin as request
    const origin = new URL(request.url).origin;
    const response = NextResponse.redirect(new URL('/', origin));
    // Clear session cookie via platform API
    response.cookies.set('session', '', {
      maxAge: 0,
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