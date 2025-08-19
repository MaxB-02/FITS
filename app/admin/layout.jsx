'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User, Package, MessageSquare, BarChart3, ArrowLeft, FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      if (response.redirected) {
        // If the API redirects, follow it
        window.location.href = response.url;
      } else {
        // Fallback: redirect to homepage
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: redirect to homepage
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to site
                </Link>
              </Button>
              <div className="h-6 w-px bg-zinc-700" />
              <h1 className="text-xl font-bold">Developer Portal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Admin</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-zinc-800 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <Link 
              href="/admin" 
              className="flex items-center space-x-2 py-4 px-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 border-b-2 border-transparent hover:border-zinc-600 transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              href="/admin/templates" 
              className="flex items-center space-x-2 py-4 px-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 border-b-2 border-transparent hover:border-zinc-600 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Templates</span>
            </Link>
            <Link 
              href="/admin/inquiries" 
              className="flex items-center space-x-2 py-4 px-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 border-b-2 border-transparent hover:border-zinc-600 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Inquiries</span>
            </Link>
            <Link 
              href="/admin/portfolio" 
              className="flex items-center space-x-2 py-4 px-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 border-b-2 border-transparent hover:border-zinc-600 transition-colors"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Portfolio</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 