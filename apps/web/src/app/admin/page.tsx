'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    // Eğer zaten giriş yapılmışsa dashboard'a yönlendir
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Sadece ADMIN veya MANAGER rolüne izin ver
        if (data.user.role !== 'ADMIN' && data.user.role !== 'MANAGER') {
          toast.error('Admin yetkisi gerekiyor');
          setIsLoading(false);
          return;
        }

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Giriş başarılı');
        router.push('/admin/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Geçersiz email veya şifre');
      }
    } catch (error) {
      toast.error('Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>360</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>360 Sehpa</h1>
          <p style={{ color: '#9ca3af' }}>Admin Panel</p>
        </div>

        {/* Login Form */}
        <div style={{ backgroundColor: '#1f2937', borderRadius: '12px', padding: '32px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '24px' }}>Yönetici Girişi</h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                Email Adresi
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
                placeholder="admin@360sehpa.com"
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#d1d5db', marginBottom: '8px' }}>
                Şifre
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#374151',
                  border: '1px solid #4b5563',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '16px',
                }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#2563eb',
                color: 'white',
                fontWeight: '500',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#374151', borderRadius: '8px' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
              Admin: <span style={{ color: '#d1d5db' }}>admin@360sehpa.com</span> / <span style={{ color: '#d1d5db' }}>Admin123!</span>
            </p>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <a href="/" style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'none' }}>
              ← Siteye Dön
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginTop: '32px' }}>
          © 2024 360 Sehpa. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
