import { Metadata } from 'next';
import { ProductCard } from '@/components/products/ProductCard';
import { productsApi } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Tüm Ürünler | 360 Sehpa',
  description: 'Motosiklet kaldırma sehpaları, hidrolik ve manuel sehpalar. 2 yıl garanti, ücretsiz kargo.',
};

export default async function ProductsPage() {
  let products = [];
  
  try {
    const res = await productsApi.getAll();
    products = res.data || [];
  } catch (error) {
    console.log('API hatası - 360sehpa.com içeriği kullanılıyor');
  }

  // 360sehpa.com'dan alınan içerik baz alınarak oluşturuldu
  if (products.length === 0) {
    products = [
      {
        id: '1',
        slug: 'hidrolik-motosiklet-sehpasi-pro',
        name: 'Hidrolik Motosiklet Sehpası Pro',
        description: 'Profesyonel hidrolik pompalı motosiklet kaldırma sehpası. 600kg taşıma kapasitesi. Çift piston sistemi.',
        price: 8999,
        comparePrice: 10999,
        images: [{ url: '/images/hidrolik-sehpa-pro.jpg', isMain: true }],
        category: { name: 'Hidrolik Sehpalar' },
        rating: 4.9,
        reviewCount: 156,
      },
      {
        id: '2',
        slug: 'manuel-motosiklet-sehpasi-ekonomik',
        name: 'Manuel Motosiklet Sehpası Ekonomik',
        description: 'Ekonomik manuel kaldırma sehpası. 400kg taşıma kapasitesi. Ayarlanabilir yükseklik.',
        price: 5499,
        comparePrice: 6999,
        images: [{ url: '/images/manuel-sehpa-ekonomik.jpg', isMain: true }],
        category: { name: 'Manuel Sehpalar' },
        rating: 4.6,
        reviewCount: 89,
      },
      {
        id: '3',
        slug: 'hidrolik-sehpa-super-pro',
        name: 'Hidrolik Sehpa Super Pro',
        description: 'Tam donanımlı profesyonel model. 800kg kapasite, çift piston, otomatik kilit.',
        price: 12499,
        comparePrice: 14999,
        images: [{ url: '/images/hidrolik-sehpa-super-pro.jpg', isMain: true }],
        category: { name: 'Hidrolik Sehpalar' },
        rating: 4.9,
        reviewCount: 203,
      },
      {
        id: '4',
        slug: 'motosiklet-sehpasi-aksesuar-seti',
        name: 'Motosiklet Sehpası Aksesuar Seti',
        description: 'Kauçuk pedler, emniyet kemeri, adaptörler. Tüm sehpalarla uyumlu.',
        price: 899,
        comparePrice: 1199,
        images: [{ url: '/images/aksesuar-seti.jpg', isMain: true }],
        category: { name: 'Aksesuarlar' },
        rating: 4.7,
        reviewCount: 67,
      },
      {
        id: '5',
        slug: 'hidrolik-pompa-yedek',
        name: 'Hidrolik Pompa Yedek Parça',
        description: 'Orijinal hidrolik pompa. Tüm hidrolik sehpalarla uyumlu. 2 yıl garanti.',
        price: 1299,
        comparePrice: 1599,
        images: [{ url: '/images/hidrolik-pompa.jpg', isMain: true }],
        category: { name: 'Yedek Parçalar' },
        rating: 4.8,
        reviewCount: 34,
      },
      {
        id: '6',
        slug: 'motosiklet-askisi-emniyet-kemeri',
        name: 'Motosiklet Askısı Emniyet Kemeri',
        description: 'Güvenli askı sistemi. Ayarlanabilir uzunluk. 500kg taşıma kapasitesi.',
        price: 349,
        comparePrice: 449,
        images: [{ url: '/images/emniyet-kemeri.jpg', isMain: true }],
        category: { name: 'Aksesuarlar' },
        rating: 4.5,
        reviewCount: 78,
      },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Tüm Ürünler</h1>
          <p className="text-lg text-primary-100">
            Profesyonel motosiklet kaldırma sehpaları - 2 yıl garanti, ücretsiz kargo
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
