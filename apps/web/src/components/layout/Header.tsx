'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Search, Phone } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { count } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Ana Sayfa' },
    { href: '/urunler', label: 'Ürünler' },
    { href: '/hakkimizda', label: 'Hakkımızda' },
    { href: '/blog', label: 'Blog' },
    { href: '/iletisim', label: 'İletişim' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-white/95 backdrop-blur-sm py-3'
      )}
    >
      {/* Top Bar */}
      <div className="bg-primary-600 text-white text-xs py-1.5 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="tel:+905551234567" className="flex items-center gap-1 hover:text-primary-100">
              <Phone className="w-3.5 h-3.5" />
              <span>0555 123 45 67</span>
            </a>
            <span>Ücretsiz Kargo - 1000 TL Üzeri</span>
          </div>
          <div className="flex items-center gap-4">
            <span>2 Yıl Garanti</span>
            <span>Hızlı Teslimat</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">360</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-gray-900">Sehpa</span>
              <span className="text-xs text-gray-500 block -mt-1">Profesyonel Ekipman</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  pathname === link.href
                    ? 'text-primary-600'
                    : 'text-gray-700'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Ara"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href={isAuthenticated ? '/hesabim' : '/giris'}
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              aria-label="Hesabım"
            >
              <User className="w-5 h-5" />
            </Link>

            <Link
              href="/sepet"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors relative"
              aria-label="Sepet"
            >
              <ShoppingCart className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700"
              aria-label="Menü"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'py-2 px-4 rounded-lg font-medium transition-colors',
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="py-2 px-4 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium"
              >
                Çıkış Yap
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
