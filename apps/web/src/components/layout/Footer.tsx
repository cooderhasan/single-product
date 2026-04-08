'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Admin sayfalarında footer'ı gizle
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Kampanyalardan Haberdar Olun
              </h3>
              <p className="text-gray-400">
                Yeni ürünler ve özel fırsatlar için bültenimize abone olun.
              </p>
            </div>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Email adresiniz"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">360</span>
              </div>
              <span className="font-bold text-xl text-white">Sehpa</span>
            </div>
            <p className="text-gray-400 mb-4">
              Türkiye'nin #1 motosiklet kaldırma sehpası üreticisi. Profesyonel
              ekipmanlar, 2 yıl garanti.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Youtube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/urunler" className="hover:text-primary-400 transition-colors">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/hakkimizda" className="hover:text-primary-400 transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-primary-400 transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kategoriler</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/kategori/hidrolik-sehpalar" className="hover:text-primary-400 transition-colors">
                  Hidrolik Sehpalar
                </Link>
              </li>
              <li>
                <Link href="/kategori/manuel-sehpalar" className="hover:text-primary-400 transition-colors">
                  Manuel Sehpalar
                </Link>
              </li>
              <li>
                <Link href="/kategori/aksesuarlar" className="hover:text-primary-400 transition-colors">
                  Aksesuarlar
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>Sanayi Mahallesi, 123. Sokak No:45<br />İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="tel:+905551234567" className="hover:text-primary-400 transition-colors">
                  0555 123 45 67
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 flex-shrink-0" />
                <a href="mailto:info@360sehpa.com" className="hover:text-primary-400 transition-colors">
                  info@360sehpa.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              {currentYear} 360 Sehpa. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/gizlilik-politikasi" className="hover:text-gray-300 transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-gray-300 transition-colors">
                Mesafeli Satış Sözleşmesi
              </Link>
              <Link href="/iade-kosullari" className="hover:text-gray-300 transition-colors">
                İade Koşulları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
