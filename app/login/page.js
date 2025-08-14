'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for error in URL params and show friendly messages
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      let errorMessage = 'Sign-in failed. See server logs.';
      
      switch (errorParam) {
        case 'OAuthCallback':
          errorMessage = 'OAuth callback failed. Check NEXTAUTH_URL and Google Authorized redirect URI.';
          break;
        case 'CallbackRouteError':
          errorMessage = 'OAuth callback route error. Verify your Google OAuth configuration.';
          break;
        case 'AccessDenied':
          errorMessage = 'Not authorized. Your email is not on the admin allowlist.';
          break;
        case 'Configuration':
          errorMessage = 'Authentication configuration error. Check environment variables.';
          break;
        case 'Verification':
          errorMessage = 'Verification failed. Please try again.';
          break;
        default:
          errorMessage = `Sign-in failed: ${errorParam}. See server logs for details.`;
      }
      
      setError(errorMessage);
    }
  }, [searchParams]);

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (session) {
        router.push('/admin');
      }
    };
    checkAuth();
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signIn('google', { 
        callbackUrl: '/admin',
        redirect: false 
      });
      
      if (result?.error) {
        setError('Google sign-in failed. Please try again.');
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('An error occurred during sign-in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Developer Portal</CardTitle>
            <CardDescription>
              Sign in with Google to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            
            <Button 
              onClick={handleGoogleSignIn}
              className="w-full mb-4" 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            <div className="text-center text-sm text-zinc-400 mb-6">
              Only authorized email addresses can access the admin area.
            </div>

            <div className="text-center">
              <Link 
                href="/" 
                className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 