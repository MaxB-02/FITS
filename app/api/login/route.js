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

    // Return JSON success and set cookie via NextResponse cookies API (Edge-safe)
    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.headers.append('Cache-Control', 'no-store');
    response.headers.append('Pragma', 'no-cache');
    response.cookies.set('session', token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 