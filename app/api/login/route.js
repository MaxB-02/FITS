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
    const token = await signSession({ 
      id: 'admin', 
      role: 'admin'
    });

    // Create response that redirects to admin
    const response = NextResponse.redirect(new URL('/admin', process.env.BASE_URL || 'http://localhost:3000'));

    // Set session cookie
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