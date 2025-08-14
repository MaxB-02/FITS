import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST() {
  try {
    // Create response that redirects to homepage
    const response = NextResponse.redirect(new URL('/', process.env.BASE_URL || 'http://localhost:3000'));
    
    // Clear session cookie by setting it to expire immediately
    response.cookies.set('session', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      sameSite: 'Lax'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback: redirect to homepage even if cookie clearing fails
    return NextResponse.redirect(new URL('/', process.env.BASE_URL || 'http://localhost:3000'));
  }
}

// Also handle GET requests for backward compatibility
export async function GET() {
  return POST();
} 