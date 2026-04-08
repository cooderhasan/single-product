'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Search, Phone, Truck, Shield, User, LogOut } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  // Admin sayfalarında header'ı gizle
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  const { count } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
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
    { href: '/urun/universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli', label: '360 Sehpa / Padog' },
    { href: '/iletisim', label: 'İletişim' },
    { href: '/kargo-takip', label: 'Kargo Takip' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar - Dark Premium */}
      <div className="bg-slate-900 text-white text-xs py-2 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a 
              href="tel:+905551234567" 
              className="flex items-center gap-2 hover:text-blue-400 transition-colors duration-200"
            >
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Phone className="w-3 h-3" />
              </div>
              <span className="font-medium">0555 123 45 67</span>
            </a>
            <span className="flex items-center gap-2 text-slate-300">
              <Truck className="w-3.5 h-3.5" />
              <span>Ücretsiz Kargo - 1000 TL Üzeri</span>
            </span>
          </div>
          <div className="flex items-center gap-6 text-slate-300">
            <span className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-green-400" />
              <span>2 Yıl Garanti</span>
            </span>
            <span className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>Hızlı Teslimat</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div 
        className={cn(
          'bg-white transition-all duration-300',
          isScrolled 
            ? 'shadow-lg shadow-slate-200/50' 
            : 'border-b border-slate-100'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo - Enhanced */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/30 transition-shadow duration-300">
                  <span className="text-white font-bold text-lg">360</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-slate-900 tracking-tight">Sehpa</span>
                <span className="text-[11px] text-slate-500 block -mt-0.5 font-medium tracking-wide">Profesyonel Ekipman</span>
              </div>
            </Link>

            {/* Desktop Navigation - Modern Style */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-5 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg',
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-1 left-5 right-5 h-0.5 bg-blue-600 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions - Enhanced Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
                aria-label="Ara"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favorites */}


              {/* Account */}
              {isMounted && (
                isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center gap-2 pl-3 pr-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all duration-200">
                      <User className="w-5 h-5" />
                      <span className="hidden sm:block text-sm font-medium truncate max-w-[100px]">{user?.firstName}</span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-3 border-b border-slate-50">
                        <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 rounded-b-xl"
                      >
                        <LogOut className="w-4 h-4" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/giris"
                    className="flex items-center justify-center w-10 h-10 sm:w-auto sm:px-3 sm:py-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all duration-200 gap-2"
                    aria-label="Giriş Yap"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:block text-sm font-medium">Giriş Yap</span>
                  </Link>
                )
              )}

              {/* Cart - Enhanced */}
              <Link
                href="/sepet"
                className="flex items-center gap-2 pl-3 pr-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-200 group"
                aria-label="Sepet"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium">Sepet</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-all duration-200 ml-1"
                aria-label="Menü"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Enhanced */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-between',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {link.label}
                  {isActive && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                </Link>
              );
            })}
            
            {/* Mobile Sepet */}
            <div className="border-t border-slate-100 mt-3 pt-3">
              <Link
                href="/sepet"
                className="flex items-center gap-3 py-3 px-4 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Sepetim</span>
                {count > 0 && (
                  <span className="ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}


