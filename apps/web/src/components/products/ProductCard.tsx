import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    price: number;
    comparePrice?: number | null;
    images: { url: string; isMain?: boolean }[];
    category?: { name: string };
    rating?: number;
    reviewCount?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images?.find(img => img.isMain)?.url || product.images?.[0]?.url || '/images/placeholder.jpg';
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group">
      {/* Image */}
      <Link href={`/urun/${product.slug}`} className="block relative aspect-square bg-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            %{discount} İndirim
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        {product.category && (
          <div className="text-xs text-primary-600 font-medium mb-1">
            {product.category.name}
          </div>
        )}

        {/* Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          <Link href={`/urun/${product.slug}`} className="hover:text-primary-600 transition-colors">
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            {product.reviewCount && (
              <span className="text-sm text-gray-500">({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-600">
            {product.price.toLocaleString('tr-TR')} ₺
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.comparePrice.toLocaleString('tr-TR')} ₺
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Link 
          href={`/urun/${product.slug}`}
          className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors block text-center"
        >
          İncele
        </Link>
      </div>
    </div>
  );
}
