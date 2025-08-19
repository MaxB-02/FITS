import { NextResponse } from 'next/server';
import { cookieSerialize } from '@/lib/auth-simple.js';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // Redirect to homepage on same origin as request
    const origin = new URL(request.url).origin;
    const response = NextResponse.redirect(new URL('/', origin));
    
    // Clear session cookie explicitly matching attributes
    const deleteCookie = cookieSerialize('session', '', {
      maxAge: 0,
      path: '/',
      sameSite: 'Lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    response.headers.set('Set-Cookie', deleteCookie);
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback: redirect to homepage even if cookie clearing fails
    const origin = new URL(request.url).origin;
    const res = NextResponse.redirect(new URL('/', origin));
    const deleteCookie = cookieSerialize('session', '', {
      maxAge: 0,
      path: '/',
      sameSite: 'Lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    res.headers.set('Set-Cookie', deleteCookie);
    return res;
  }
}

// Also handle GET requests for backward compatibility
export async function GET(request) {
  return POST(request);
} 