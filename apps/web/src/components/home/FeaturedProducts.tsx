import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Öne Çıkan Ürünler
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            En çok tercih edilen profesyonel motosiklet sehpalarımızı keşfedin.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/urunler"
            className="inline-flex items-center px-8 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold rounded-lg transition-all"
          >
            Tüm Ürünleri Gör
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: Product }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041';
  let mainImageUrl = '';
  if (product.images && product.images.length > 0) {
    const firstImg = product.images[0];
    const mainImg = product.images.find(img => typeof img === 'object' && img?.isMain);
    if (mainImg && typeof mainImg === 'object' && 'url' in mainImg) {
      mainImageUrl = mainImg.url;
    } else if (typeof firstImg === 'string') {
      mainImageUrl = firstImg;
    } else if (typeof firstImg === 'object' && 'url' in firstImg) {
      mainImageUrl = firstImg.url;
    }
  }
  const mainImage = typeof mainImageUrl === 'string' && mainImageUrl ? (mainImageUrl.startsWith('http') ? mainImageUrl : `${apiBase}${mainImageUrl}`) : null;

  return (
    <Link href={`/urun/${product.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className="absolute inset-0 flex items-center justify-center" 
            style={{ display: mainImage ? 'none' : 'flex' }}
          >
            <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          {product.comparePrice && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              İndirim
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(Number(product.price))}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(Number(product.comparePrice))}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
