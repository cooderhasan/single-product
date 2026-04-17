'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { contactApi, siteContentApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { trackContactFormSubmission } from '@/components/analytics/dataLayer';

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: '0555 123 45 67',
    email: 'info@360sehpa.com',
    address: 'Sanayi Mahallesi, 123. Sokak No:45\nİstanbul, Türkiye',
    workingHours: 'Pazartesi - Cuma: 09:00 - 18:00\nCumartesi: 10:00 - 14:00'
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await siteContentApi.getByKey('contact_info');
        if (response.data && response.data.data?.contactInfo) {
          setContactInfo(response.data.data.contactInfo);
        }
      } catch (error) {
        console.error('Contact info fetch error:', error);
      }
    };

    fetchContactInfo();
  }, []);

  const validateEmail = (email: string) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form doğrulama
    if (!formData.name.trim()) {
      toast.error('Lütfen adınızı ve soyadınızı giriniz');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Lütfen e-posta adresinizi giriniz');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      toast.error('Lütfen geçerli bir e-posta adresi giriniz');
      return;
    }
    
    if (formData.phone && formData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Lütfen geçerli bir telefon numarası giriniz');
      return;
    }
    
    if (!formData.message.trim()) {
      toast.error('Lütfen mesajınızı giriniz');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await contactApi.send(formData);
      toast.success('Mesajınız başarıyla gönderildi! Uzman ekibimiz en kısa sürede sizinle iletişime geçecektir.');
      
      // Track contact form submission
      trackContactFormSubmission('contact_form');
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Contact error:', error);
      toast.error(error.response?.data?.message || 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-lg text-primary-100">
            Bize ulaşın, size yardımcı olalım
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">İletişim Bilgileri</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Telefon</h3>
                  <a href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} className="text-primary-600 hover:underline">
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">E-posta</h3>
                  <a href={`mailto:${contactInfo.email}`} className="text-primary-600 hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adres</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {contactInfo.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {contactInfo.workingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6">Bize Mesaj Gönderin</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Adınız Soyadınız *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-600 focus:ring-0 transition-all duration-200 outline-none font-medium placeholder:text-slate-300 hover:border-slate-300 shadow-sm"
                  placeholder="Adınız ve soyadınız"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">E-posta *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-600 focus:ring-0 transition-all duration-200 outline-none font-medium placeholder:text-slate-300 hover:border-slate-300 shadow-sm"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 11) {
                      setFormData({ ...formData, phone: val });
                    }
                  }}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-600 focus:ring-0 transition-all duration-200 outline-none font-medium placeholder:text-slate-300 hover:border-slate-300 shadow-sm"
                  placeholder="05XX XXX XX XX"
                  maxLength={11}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Mesajınız *</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:border-primary-600 focus:ring-0 transition-all duration-200 outline-none font-medium placeholder:text-slate-300 hover:border-slate-300 shadow-sm resize-none"
                  placeholder="Mesajınızı buraya yazınız..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
