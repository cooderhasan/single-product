'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { siteContentApi } from '@/lib/api';

interface ProductShowcaseData {
  id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  features?: string[];
}

// Varsayılan içerik (API çalışmadığında)
const defaultContent: ProductShowcaseData = {
  title: 'Motosiklet bakımını bir sanat haline getir; her açıdan eriş, her hareketi kontrol et, her an güven içinde ol.',
  subtitle: '',
  description: '360 Derece Tam Döner Mekanizma: Motosikletini kaldırmanın ötesinde, her yöne 360 derece döndürebilirsin! Zincir yağlama, fren balata değişimi, motor bileşenlerine erişim veya lastik tamiri gibi işlerde motosikleti istediğin açıya getir – eğilmek, zorlanmak yok! Standart sehpalarda sınırlı hareket varken, bu senin zamanını ve enerjini %50\'ye varan oranda tasarruf ettirir. Bakım süren kısalır, keyfin artar!',
  image: '/images/sehpa-motor.jpg',
  buttonText: 'SATIN AL',
  buttonLink: '/urun/universal-motosiklet-kaldirma-sehpasi-360-derece-doner-kilitli',
  features: [
    '360° Döner Mekanizma',
    'Kilitli Tekerlekler',
    'Dayanıklı Çelik Gövde',
    'Universal Uyum',
  ],
};

export function ProductShowcase() {
  const [content, setContent] = useState<ProductShowcaseData>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await siteContentApi.getByKey('product_showcase');
        if (response.data) {
          const data = response.data;
          setContent({
            title: data.title || defaultContent.title,
            subtitle: data.subtitle,
            description: data.description || defaultContent.description,
            image: data.image || defaultContent.image,
            buttonText: data.buttonText || defaultContent.buttonText,
            buttonLink: data.buttonLink || defaultContent.buttonLink,
            features: data.data?.features || defaultContent.features,
          });
        }
      } catch (error) {
        console.log('API bağlantı hatası - varsayılan içerik kullanılıyor');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Görsel */}
           <motion.div
             initial={{ opacity: 0, x: -30 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.6 }}
             className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-gray-200"
           >
             {content.image ? (
               <img
                 src={typeof content.image === 'string' && content.image.startsWith('http') ? content.image : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041'}${content.image}`}
                 alt={content.title}
                 className="w-full h-full object-cover"
                 onError={(e) => {
                   e.currentTarget.style.display = 'none';
                   const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                   if (placeholder) placeholder.style.display = 'flex';
                 }}
               />
             ) : null}
             <div 
               className="absolute inset-0 flex items-center justify-center"
               style={{ display: content.image ? 'none' : 'flex' }}
             >
               <svg className="w-32 h-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
             </div>
           </motion.div>

          {/* İçerik */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {content.title}
            </h2>
            
            {content.subtitle && (
              <p className="text-xl text-primary-600 font-semibold">
                {content.subtitle}
              </p>
            )}
            
            {content.description && (
              <div className="prose prose-lg text-gray-600">
                <p className="leading-relaxed">
                  {content.description}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              {content.buttonLink && (
                <Link
                  href={content.buttonLink}
                  className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all hover:scale-105 shadow-lg"
                >
                  {content.buttonText || 'SATIN AL'}
                </Link>
              )}
              <Link
                href="/urunler"
                className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-all border-2 border-gray-200"
              >
                Tüm Ürünler
              </Link>
            </div>

            {/* Özellikler */}
            {content.features && content.features.length > 0 && (
              <div className="grid grid-cols-2 gap-4 pt-6">
                {content.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
