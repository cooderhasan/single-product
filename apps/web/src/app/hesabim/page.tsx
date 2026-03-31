'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, LogOut, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, fetchUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }
    fetchUser();
  }, [isAuthenticated, router, fetchUser]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Package,
      title: 'Siparişlerim',
      description: 'Siparişlerinizi takip edin',
      href: '/hesabim/siparisler',
    },
    {
      icon: MapPin,
      title: 'Adreslerim',
      description: 'Teslimat adreslerinizi yönetin',
      href: '/hesabim/adresler',
    },
    {
      icon: User,
      title: 'Profilim',
      description: 'Hesap bilgilerinizi düzenleyin',
      href: '/hesabim/profil',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="grid gap-4">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary-600" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-red-600">Çıkış Yap</h2>
              <p className="text-sm text-gray-600">Hesabınızdan çıkış yapın</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
