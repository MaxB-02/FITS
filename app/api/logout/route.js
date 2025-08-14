import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    // Redirect to NextAuth signout endpoint
    const response = NextResponse.redirect(new URL('/api/auth/signout', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback: redirect to homepage
    return NextResponse.redirect(new URL('/', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
  }
}

// Also handle GET requests for backward compatibility
export async function GET() {
  return POST();
} 