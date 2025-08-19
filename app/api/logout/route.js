import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request) {
  try {
    // Redirect to homepage on same origin as request
    const origin = new URL(request.url).origin;
    const response = NextResponse.redirect(new URL('/', origin));
    
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
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(new URL('/', origin));
  }
}

// Also handle GET requests for backward compatibility
export async function GET(request) {
  return POST(request);
} 