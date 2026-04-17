'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, 
  Mail, 
  User, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { trackLogin, trackSignUp } from '@/components/analytics/dataLayer';

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
    clearError();
  }, [activeTab, clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email: string) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'login') {
      if (!formData.email || !formData.password) {
        toast.error('Lütfen tüm alanları doldurun');
        return;
      }
      if (!validateEmail(formData.email)) {
        toast.error('Lütfen geçerli bir e-posta adresi giriniz');
        return;
      }
      await login(formData.email, formData.password);
    } else {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        toast.error('Lütfen tüm alanları doldurun');
        return;
      }
      if (!validateEmail(formData.email)) {
        toast.error('Lütfen geçerli bir e-posta adresi giriniz');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Şifreniz en az 6 karakter olmalıdır');
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
      
      // Analytics tracking
      if (activeTab === 'login') {
        trackLogin('email');
      } else {
        trackSignUp('email');
      }
    } else if (error) {
      toast.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -ml-48 -mb-48" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white p-8 sm:p-12 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative z-10">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-600/20"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              {activeTab === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              {activeTab === 'login' 
                ? 'Siparişlerinizi takip etmek ve avantajlardan yararlanmak için giriş yapın.' 
                : '360° ayrılacalığına adım atmak için hemen kayıt olun.'}
            </p>
          </div>

          {/* New Tab Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-10">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black rounded-xl transition-all ${
                activeTab === 'login' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab('login')}
              type="button"
            >
              Giriş Yap
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-black rounded-xl transition-all ${
                activeTab === 'register' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
              onClick={() => setActiveTab('register')}
              type="button"
            >
              Kayıt Ol
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: activeTab === 'login' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: activeTab === 'login' ? 10 : -10 }}
                className="space-y-4"
              >
                {activeTab === 'register' && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adınız</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none font-medium placeholder:text-slate-400 hover:border-slate-300"
                          placeholder="Ad"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Soyadınız</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                        <input
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none font-medium placeholder:text-slate-400 hover:border-slate-300"
                          placeholder="Soyad"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-posta</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none font-medium placeholder:text-slate-400 hover:border-slate-300"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Şifre</label>
                    {activeTab === 'login' && (
                        <Link href="/sifre-yenile" className="text-xs font-bold text-primary-600 hover:text-primary-700 underline">Unuttum?</Link>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 outline-none font-medium placeholder:text-slate-400 hover:border-slate-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-[20px] transition-all hover:scale-[1.01] shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin" />
              ) : (
                <>
                  {activeTab === 'login' ? 'GİRİŞ YAP' : 'ÜYE OL'}
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-slate-400 font-bold tracking-widest uppercase">veya</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push('/sepet')}
              className="w-full py-5 px-6 bg-white border-2 border-slate-100 hover:bg-slate-50 text-slate-600 font-black rounded-[20px] transition-all flex items-center justify-center gap-3 active:scale-95 group"
            >
              ÜYE OLMADAN DEVAM ET
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-primary-600 transition-all" />
            </button>
          </form>

          {/* Footer Features */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-slate-50 pt-10">
            <div className="text-center">
               <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-emerald-600">
                  <Zap className="w-5 h-5" />
               </div>
               <p className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">Hızlı İşlem</p>
            </div>
            <div className="text-center border-x border-slate-50">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-blue-600">
                  <ShieldCheck className="w-5 h-5" />
               </div>
               <p className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">Güvenli Veri</p>
            </div>
            <div className="text-center">
               <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mx-auto mb-2 text-amber-600">
                  <Star className="w-5 h-5" />
               </div>
               <p className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">Avantajlar</p>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-slate-400 text-sm font-medium">
          Yardıma mı ihtiyacınız var? <Link href="/iletisim" className="text-primary-600 font-bold hover:underline">Destek Merkezi</Link>
        </p>
      </motion.div>
    </div>
  );
}
