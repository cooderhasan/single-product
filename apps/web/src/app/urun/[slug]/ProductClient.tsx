'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Star, Truck, Shield, Award, Check } from 'lucide-react';

interface ProductClientProps {
  product: {
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    alert(`Sepete ${quantity} adet ürün eklendi! (Demo)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                  <p>{product.images[selectedImage]?.alt || product.name}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-white rounded-lg shadow-sm overflow-hidden border-2 ${
                    selectedImage === index ? 'border-primary-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-300 rounded"></div>
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
                  className="px-3 py-1 hover:bg-gray-50"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">{quantity}</span>
                <button
                  className="px-3 py-1 hover:bg-gray-50"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
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

            {/* Add to Cart Button */}
            <div className="flex gap-4">
              <button 
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                onClick={handleAddToCart}
              >
                Sepete Ekle
              </button>
              <button 
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                onClick={() => alert('Favorilere eklendi! (Demo)')}
              >
                ❤️
              </button>
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
