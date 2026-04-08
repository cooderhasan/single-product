'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Bell,
  Search,
  Layout,
  Megaphone,
} from 'lucide-react';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/urunler', label: 'Ürünler', icon: Package },
  { href: '/admin/siparisler', label: 'Siparişler', icon: ShoppingCart },
  { href: '/admin/kategoriler', label: 'Kategoriler', icon: Tag },
  { href: '/admin/musteriler', label: 'Müşteriler', icon: Users },
  { href: '/admin/kuponlar', label: 'Kuponlar', icon: Tag },
  { href: '/admin/bannerlar', label: 'Bannerlar', icon: ImageIcon },
  { href: '/admin/icerikler', label: 'Site İçerikleri', icon: Layout },
  { href: '/admin/yorumlar', label: 'Müşteri Yorumları', icon: Users },
  { href: '/admin/duyurular', label: 'Duyurular', icon: Megaphone },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Admin giriş sayfası (sadece /admin) için sidebar ve header'ı gizle
  const isLoginPage = pathname === '/admin';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar - Giriş sayfasında gizle */}
      {!isLoginPage && (
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-gray-900 w-64`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 bg-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">360</span>
            </div>
            <span className="text-white font-semibold">Admin</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>
      )}

      {/* Main Content */}
      <div className={`${!isLoginPage && isSidebarOpen ? 'lg:ml-64' : ''} transition-margin`}>
        {/* Header - Giriş sayfasında gizle */}
        {!isLoginPage && (
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="bg-transparent border-none outline-none text-sm w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </header>
        )}

        {/* Page Content */}
        <main className={isLoginPage ? '' : 'p-6'}>{children}</main>
      </div>

      {/* Mobile Overlay */}
      {!isLoginPage && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
