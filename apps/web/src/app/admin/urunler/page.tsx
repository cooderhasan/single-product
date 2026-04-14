'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Package,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductImage {
  url: string;
  isMain?: boolean;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category?: {
    name: string;
  };
  isActive: boolean;
  images?: ProductImage[];
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3041';
  
  const getImageUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${apiBase}${url}`;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || data);
      } else {
        toast.error('Ürünler yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Products fetch error:', error);
      toast.error('Ürünler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Ürün başarıyla silindi');
        setProducts(products.filter(p => p.id !== id));
      } else {
        toast.error('Ürün silinirken hata oluştu');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Ürün silinirken hata oluştu');
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
          <p className="text-gray-500">Ürün kataloğunu yönetin</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Ürün
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {(typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url) ? (
                          <>
                            <img 
                              src={getImageUrl(product.images[0].url)} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }}
                            />
                            <div className="absolute inset-0 items-center justify-center hidden bg-gray-100">
                              <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          </>
                        ) : (
                          <Package className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {Number(product.price).toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category?.name || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => router.push(`/urun/${product.slug || product.id}`)}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <Link 
                        href={`/admin/urunler/duzenle/${product.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Ürün bulunamadı</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <p className="text-sm text-gray-500">
            Toplam {filteredProducts.length} ürün
          </p>
        </div>
      </div>
    </div>
  );
}
