'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="border-b border-zinc-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-emerald-500">
          <Link href="/">Freak in the Sheets</Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link 
            href="/" 
            className={`transition-colors ${
              isActive('/') 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Home
          </Link>
          <Link 
            href="/templates" 
            className={`transition-colors ${
              isActive('/templates') 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={isActive('/templates') ? 'page' : undefined}
          >
            Templates
          </Link>
          <Link 
            href="/portfolio" 
            className={`transition-colors ${
              isActive('/portfolio') 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={isActive('/portfolio') ? 'page' : undefined}
          >
            Portfolio
          </Link>
          <Link 
            href="/admin" 
            className={`transition-colors ${
              isActive('/admin') 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-current={isActive('/admin') ? 'page' : undefined}
          >
            Admin
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Start a Project Button - Desktop */}
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/inquire">Start a Project</Link>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950">
          <nav className="container mx-auto px-4 py-4 space-y-4">
            <Link 
              href="/" 
              className={`block py-2 transition-colors ${
                isActive('/') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive('/') ? 'page' : undefined}
            >
              Home
            </Link>
            <Link 
              href="/templates" 
              className={`block py-2 transition-colors ${
                isActive('/templates') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive('/templates') ? 'page' : undefined}
            >
              Templates
            </Link>
            <Link 
              href="/portfolio" 
              className={`block py-2 transition-colors ${
                isActive('/portfolio') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive('/portfolio') ? 'page' : undefined}
            >
              Portfolio
            </Link>
            <Link 
              href="/admin" 
              className={`block py-2 transition-colors ${
                isActive('/admin') 
                  ? 'text-foreground font-medium' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => setMobileMenuOpen(false)}
              aria-current={isActive('/admin') ? 'page' : undefined}
            >
              Admin
            </Link>
            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/inquire" onClick={() => setMobileMenuOpen(false)}>
                  Start a Project
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 