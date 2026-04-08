'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Tag, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  parentId?: string;
  parent?: { name: string };
  _count?: { products: number };
  children?: Category[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        toast.error('Kategoriler yüklenirken hata oluştu');
      }
    } catch (error) {
      toast.error('Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success('Kategori silindi');
        fetchCategories();
      } else {
        toast.error('Silme başarısız');
      }
    } catch (error) {
      toast.error('Hata oluştu');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const getProductCount = (category: Category): number => {
    return category._count?.products || 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kategoriler</h1>
          <p className="text-gray-500">Ürün kategorilerini yönetin</p>
        </div>
        <Link
          href="/admin/kategoriler/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Kategori
        </Link>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Tüm Kategoriler</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Henüz kategori bulunmuyor.
            </div>
          ) : (
            categories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center justify-between p-6 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    {(category.children && category.children.length > 0) && (
                      <button
                        onClick={() => toggleExpand(category.id)}
                        className={`p-1 text-gray-400 hover:text-gray-600 transition-transform ${
                          expandedCategories.includes(category.id) ? 'rotate-90' : ''
                        }`}
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Tag className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-500">/{category.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{getProductCount(category)}</p>
                      <p className="text-xs text-gray-500">Ürün</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-900">{category.sortOrder}</p>
                      <p className="text-xs text-gray-500">Sıra</p>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/kategoriler/duzenle/${category.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {expandedCategories.includes(category.id) && category.children && category.children.length > 0 && (
                  <div className="bg-gray-50">
                    {category.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-6 pl-16 border-t border-gray-100 hover:bg-gray-100"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Tag className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{child.name}</p>
                            <p className="text-sm text-gray-500">/{child.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">{getProductCount(child)}</p>
                            <p className="text-xs text-gray-500">Ürün</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold text-gray-900">{child.sortOrder}</p>
                            <p className="text-xs text-gray-500">Sıra</p>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            child.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {child.isActive ? 'Aktif' : 'Pasif'}
                          </span>
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/admin/kategoriler/duzenle/${child.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(child.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
