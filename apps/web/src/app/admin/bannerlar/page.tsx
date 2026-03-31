'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Image as ImageIcon, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

const banners = [
  {
    id: '1',
    title: 'Profesyonel Motosiklet Sehpaları',
    subtitle: 'Türkiye\'nin #1 Motosiklet Kaldırma Sehpası Üreticisi',
    position: 'HOME_HERO',
    link: '/kategori/motosiklet-sehpalari',
    sortOrder: 1,
    isActive: true,
    views: 1250,
    clicks: 85,
  },
  {
    id: '2',
    title: 'Hidrolik Seri',
    subtitle: 'Tek parmakla kaldırın',
    position: 'HOME_HERO',
    link: '/kategori/hidrolik-sehpalar',
    sortOrder: 2,
    isActive: true,
    views: 980,
    clicks: 62,
  },
  {
    id: '3',
    title: 'Yaz İndirimi',
    subtitle: 'Seçili ürünlerde %20 indirim',
    position: 'HOME_PROMO',
    link: '/kampanya/yaz-indirimi',
    sortOrder: 1,
    isActive: false,
    views: 0,
    clicks: 0,
  },
];

const positionLabels: Record<string, string> = {
  HOME_HERO: 'Ana Sayfa - Hero',
  HOME_PROMO: 'Ana Sayfa - Promosyon',
  HOME_CATEGORY: 'Ana Sayfa - Kategori',
  PRODUCT_DETAIL: 'Ürün Detay',
};

export default function BannersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bannerlar</h1>
          <p className="text-gray-500">Slider ve banner yönetimi</p>
        </div>
        <Link
          href="/admin/bannerlar/yeni"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Yeni Banner
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Toplam Banner</p>
          <p className="text-2xl font-bold text-gray-900">{banners.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="text-2xl font-bold text-green-600">{banners.filter(b => b.isActive).length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Toplam Görüntülenme</p>
          <p className="text-2xl font-bold text-blue-600">
            {banners.reduce((acc, b) => acc + b.views, 0).toLocaleString('tr-TR')}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Toplam Tıklama</p>
          <p className="text-2xl font-bold text-purple-600">
            {banners.reduce((acc, b) => acc + b.clicks, 0).toLocaleString('tr-TR')}
          </p>
        </div>
      </div>

      {/* Banners List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Banner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pozisyon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sıra</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İstatistikler</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{banner.title}</p>
                        <p className="text-sm text-gray-500">{banner.subtitle}</p>
                        <p className="text-xs text-primary-600 mt-1">{banner.link}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {positionLabels[banner.position] || banner.position}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{banner.sortOrder}</span>
                      <div className="flex flex-col">
                        <button className="text-gray-400 hover:text-gray-600">
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">{banner.views.toLocaleString('tr-TR')}</span> görüntülenme
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">{banner.clicks.toLocaleString('tr-TR')}</span> tıklama
                      </p>
                      {banner.views > 0 && (
                        <p className="text-xs text-gray-500">
                          CTR: %{((banner.clicks / banner.views) * 100).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                      banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {banner.isActive ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Aktif
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Pasif
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
