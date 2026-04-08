'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Clear old errors when switching tabs
    clearError();
  }, [activeTab, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'login') {
      if (!formData.email || !formData.password) {
        toast.error('Lütfen tüm alanları doldurun');
        return;
      }
      await login(formData.email, formData.password);
    } else {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast.error('Lütfen tüm alanları doldurun');
        return;
      }
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
    }

    if (!error && isAuthenticated) {
      toast.success(activeTab === 'login' ? 'Giriş başarılı' : 'Kayıt başarılı');
    } else if (error) {
      toast.error(error);
    }
  };

  if (isAuthenticated) {
    return null; // Don't render anything if already authenticated
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {activeTab === 'login' ? 'Hesabınıza Giriş Yapın' : 'Yeni Hesap Oluşturun'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {activeTab === 'login' ? 'Siparişlerinizi takip etmek için giriş yapın.' : 'Ayrıcalıklardan faydalanmak için hemen üye olun.'}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'login' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('login')}
            type="button"
          >
            Giriş Yap
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === 'register' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('register')}
            type="button"
          >
            Kayıt Ol
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {activeTab === 'register' && (
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adınız</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Adınız"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Soyadınız</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresi</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  name="password"
                  type="password"
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-70"
          >
            {isLoading ? 'İşleniyor...' : (activeTab === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
            {!isLoading && <ChevronRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
