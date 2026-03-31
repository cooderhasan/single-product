import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star, Truck, Shield, Award, Check } from 'lucide-react';

// Demo ürün detayları
const products = {
  'hidrolik-motosiklet-sehpasi-pro': {
    name: 'Hidrolik Motosiklet Sehpası Pro',
    description: 'Profesyonel hidrolik pompalı motosiklet kaldırma sehpası. 600kg taşıma kapasitesi. Çift piston sistemi.',
    price: 8999,
    comparePrice: 10999,
    images: [
      { url: '/images/hidrolik-sehpa-pro-1.jpg', alt: 'Hidrolik Sehpa Pro' },
      { url: '/images/hidrolik-sehpa-pro-2.jpg', alt: 'Detay görünüm' },
      { url: '/images/hidrolik-sehpa-pro-3.jpg', alt: 'Çift piston sistemi' },
    ],
    category: 'Hidrolik Sehpalar',
    rating: 4.9,
    reviewCount: 156,
    features: [
      '600kg taşıma kapasitesi',
      'Çift piston sistemi',
      'Otomatik kilit mekanizması',
      'Kauçuk yüzey koruyucu pedler',
      'Ayarlanabilir yükseklik',
      '2 yıl garanti',
    ],
    specifications: [
      { label: 'Kapasite', value: '600kg' },
      { label: 'Yükseklik Aralığı', value: '30-80cm' },
      { label: 'Ağırlık', value: '25kg' },
      { label: 'Malzeme', value: 'Çelik' },
      { label: 'Garanti', value: '24 Ay' },
    ],
  },
  'manuel-motosiklet-sehpasi-ekonomik': {
    name: 'Manuel Motosiklet Sehpası Ekonomik',
    description: 'Ekonomik manuel kaldırma sehpası. 400kg taşıma kapasitesi. Ayarlanabilir yükseklik.',
    price: 5499,
    comparePrice: 6999,
    images: [
      { url: '/images/manuel-sehpa-ekonomik-1.jpg', alt: 'Manuel Sehpa Ekonomik' },
      { url: '/images/manuel-sehpa-ekonomik-2.jpg', alt: 'Detay görünüm' },
    ],
    category: 'Manuel Sehpalar',
    rating: 4.6,
    reviewCount: 89,
    features: [
      '400kg taşıma kapasitesi',
      'Manuel kaldırma sistemi',
      'Kompakt tasarım',
      'Kolay kurulum',
      'Ekonomik fiyat',
      '1 yıl garanti',
    ],
    specifications: [
      { label: 'Kapasite', value: '400kg' },
      { label: 'Yükseklik Aralığı', value: '25-70cm' },
      { label: 'Ağırlık', value: '18kg' },
      { label: 'Malzeme', value: 'Çelik' },
      { label: 'Garanti', value: '12 Ay' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(products).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = products[params.slug as keyof typeof products];
  
  if (!product) {
    return {
      title: 'Ürün Bulunamadı',
    };
  }

  return {
    title: `${product.name} | 360 Sehpa`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products[params.slug as keyof typeof products];
  
  if (!product) {
    notFound();
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm">
            <a href="/" className="text-gray-500 hover:text-gray-700">Ana Sayfa</a>
            <span className="mx-2 text-gray-400">/</span>
            <a href="/urunler" className="text-gray-500 hover:text-gray-700">Ürünler</a>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                  <p>{product.images[0]?.alt || product.name}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div key={index} className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="text-sm text-primary-600 font-medium mb-2">{product.category}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviewCount} değerlendirme)</span>
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-primary-600">
                {product.price.toLocaleString('tr-TR')} ₺
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {product.comparePrice.toLocaleString('tr-TR')} ₺
                  </span>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    %{discount} İndirim
                  </span>
                </>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Özellikler</h3>
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Link 
                href="/sepete-ekle" 
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors text-center"
              >
                Sepete Ekle
              </Link>
              <Link 
                href="/favoriler" 
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ❤️
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Ücretsiz Kargo</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">2 Yıl Garanti</div>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Kalite Garantisi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6">Teknik Özellikler</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.specifications.map((spec, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">{spec.label}</span>
                <span className="font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
