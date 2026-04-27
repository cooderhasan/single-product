'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star, Truck, Shield, Award, Check, Heart, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import toast from 'react-hot-toast';

interface ProductClientProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number | null;
    images: { url: string; alt: string }[];
    category: string;
    rating: number;
    reviewCount: number;
    features: string[];
    specifications: { label: string; value: string }[];
  };
}

export default function ProductClient({ product }: ProductClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const { addItem, isLoading } = useCartStore();

  useEffect(() => {
    const handleScroll = () => {
      const addToCartSection = document.getElementById('add-to-cart-section');
      if (addToCartSection) {
        const rect = addToCartSection.getBoundingClientRect();
        // Show sticky bar when the add-to-cart button is out of view (above the viewport)
        setShowStickyBar(rect.bottom < 0);
      } else {
        const scrollY = window.scrollY || window.pageYOffset;
        setShowStickyBar(scrollY > 400);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Görsel URL'sini al (page.tsx'ten zaten tam URL geliyor)
  const getImageUrl = (u: any) => {
    if (!u) return '';
    const str = typeof u === 'string' ? u : u?.url;
    if (!str) return '';
    if (str.startsWith('http')) return str;
    if (str.startsWith('/')) return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041'}${str}`;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041'}/uploads/${str}`;
  };

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = async () => {
    try {
      await addItem(product.id, quantity);
      toast.success('Ürün sepete eklendi!');
    } catch {
      toast.error('Ürün eklenirken bir hata oluştu');
    }
  };

  const handleBuyNow = async () => {
    try {
      await addItem(product.id, quantity);
      router.push('/sepet');
    } catch {
      toast.error('Ürün eklenirken bir hata oluştu');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Add to Cart Bar */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-[0_-5px_15px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out ${
          showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Ürün Bilgisi */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {product.images[0]?.url && (
                <img
                  src={getImageUrl(product.images[0].url)}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
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
              </div>
            </div>

            {/* Adet + Butonlar */}
            <div className="flex items-center gap-3">
              {/* Adet Seçici */}
              <div className="flex items-center border rounded-lg">
                <button
                  className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-x min-w-[3rem] text-center font-medium text-sm">{quantity}</span>
                <button
                  className="px-3 py-2 hover:bg-gray-50"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Sepete Ekle */}
              <button
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 whitespace-nowrap"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                <ShoppingCart className="w-5 h-5" />
                {isLoading ? 'Ekleniyor...' : 'Sepete Ekle'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">Ana Sayfa</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/urunler" className="text-gray-500 hover:text-gray-700">Ürünler</Link>
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
              {product.images[selectedImage]?.url ? (
                <img
                  src={getImageUrl(product.images[selectedImage].url)}
                  alt={product.images[selectedImage].alt || product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" 
                style={{ display: product.images[selectedImage]?.url ? 'none' : 'flex' }}
              >
                <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg shadow-sm overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                 >
                   {image.url ? (
                     <img
                       src={getImageUrl(image.url)}
                       alt={image.alt || product.name}
                       className="w-full h-full object-contain"
                       onError={(e) => {
                         e.currentTarget.style.display = 'none';
                         const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                         if (placeholder) placeholder.style.display = 'flex';
                       }}
                     />
                   ) : null}
                   <div 
                     className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                     style={{ display: image.url ? 'none' : 'flex' }}
                   >
                     <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                   </div>
                 </button>
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

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Adet:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 border-x min-w-[3rem] text-center font-medium">{quantity}</span>
                <button
                  className="px-3 py-2 hover:bg-gray-50"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
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

            {/* Add to Cart Buttons */}
            <div id="add-to-cart-section" className="flex gap-4">
              <button 
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                <ShoppingCart className="w-5 h-5" />
                {isLoading ? 'Ekleniyor...' : 'Sepete Ekle'}
              </button>
              <button 
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                onClick={handleBuyNow}
                disabled={isLoading}
              >
                Hemen Al
              </button>
              <button 
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => toast.success('Favorilere eklendi!')}
              >
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Ücretsiz Kargo</div>
              </div>
              <div className="text-center">
                <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">Kalite Garantisi</div>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-xs text-gray-600">14 Gün İade</div>
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
