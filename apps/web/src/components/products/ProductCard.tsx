import Link from 'next/link';
import React from 'react';
import { Star } from 'lucide-react';
import { useCartStore } from '@/store/cart';

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
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041';
  
  let imageUrl = '';
  if (product.images && product.images.length > 0) {
    const firstImg = product.images[0];
    const mainImg = product.images.find(img => typeof img === 'object' && img?.isMain);
    if (mainImg && typeof mainImg === 'object' && 'url' in mainImg) {
      imageUrl = mainImg.url;
    } else if (typeof firstImg === 'string') {
      imageUrl = firstImg;
    } else if (typeof firstImg === 'object' && 'url' in firstImg) {
      imageUrl = firstImg.url;
    }
  }
  const mainImage = typeof imageUrl === 'string' && imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${apiBase}${imageUrl}`) : null;
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = React.useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    try {
      await addItem(product.id, 1);
      alert('ÃœrÃ¼n sepete eklendi!');
    } catch (error) {
      console.error('Sepete ekleme hatasÄ±:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all group">
      {/* Image */}
      <Link href={`/urun/${product.slug}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ display: mainImage ? 'none' : 'flex' }}>
          <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
            %{discount} Ä°ndirim
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
            {product.price.toLocaleString('tr-TR')} â‚º
          </span>
          {product.comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              {product.comparePrice.toLocaleString('tr-TR')} â‚º
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Link 
          href={`/urun/${product.slug}`}
          className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors block text-center"
        >
          Ä°ncele
        </Link>
      </div>
    </div>
  );
}

