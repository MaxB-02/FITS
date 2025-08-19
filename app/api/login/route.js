import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, signSession, cookieSerialize } from '@/lib/auth-simple.js';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // Basic validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials
    if (!verifyCredentials(username, password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session
    const token = await signSession({ id: 'admin', role: 'admin' });

    // Return JSON success and set cookie on the response (more reliable with fetch)
    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.headers.append('Cache-Control', 'no-store');
    response.headers.append('Pragma', 'no-cache');

    const cookie = cookieSerialize('session', token, {
      maxAge: 604800, // 7 days
      path: '/',
      sameSite: 'Lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    response.headers.set('Set-Cookie', cookie);
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 