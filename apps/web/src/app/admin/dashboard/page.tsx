'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react';

const stats = [
  {
    title: 'Toplam Ciro',
    value: '₺128,450',
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-blue-500',
  },
  {
    title: 'Siparişler',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-green-500',
  },
  {
    title: 'Müşteriler',
    value: '1,234',
    change: '+15.3%',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500',
  },
  {
    title: 'Ürünler',
    value: '89',
    change: '-2.1%',
    trend: 'down',
    icon: Package,
    color: 'bg-orange-500',
  },
];

const recentOrders = [
  { id: '1', orderNumber: 'SP-240315-001', customer: 'Ahmet Yılmaz', total: 8999, status: 'Tamamlandı', date: '2024-03-15' },
  { id: '2', orderNumber: 'SP-240315-002', customer: 'Mehmet Kaya', total: 12499, status: 'Kargoda', date: '2024-03-15' },
  { id: '3', orderNumber: 'SP-240314-003', customer: 'Ayşe Demir', total: 5499, status: 'Hazırlanıyor', date: '2024-03-14' },
  { id: '4', orderNumber: 'SP-240314-004', customer: 'Fatma Şahin', total: 18999, status: 'Tamamlandı', date: '2024-03-14' },
  { id: '5', orderNumber: 'SP-240313-005', customer: 'Ali Yıldız', total: 7499, status: 'Bekliyor', date: '2024-03-13' },
];

const topProducts = [
  { name: 'Hidrolik Motosiklet Sehpası Pro', sales: 45, revenue: 404955 },
  { name: 'Hidrolik Sehpa Super Pro', sales: 32, revenue: 399968 },
  { name: 'Manuel Motosiklet Sehpası Ekonomik', sales: 28, revenue: 153972 },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simüle edilmiş veri yükleme
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <select className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option>Son 7 Gün</option>
            <option>Son 30 Gün</option>
            <option>Bu Ay</option>
            <option>Bu Yıl</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-400">bu ay</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
            <Link
              href="/admin/siparisler"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Tümünü Gör →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{order.total.toLocaleString('tr-TR')} ₺</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'Tamamlandı' ? 'bg-green-100 text-green-800' :
                        order.status === 'Kargoda' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Hazırlanıyor' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Çok Satan Ürünler</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sales} satış</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {product.revenue.toLocaleString('tr-TR')} ₺
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/urunler"
              className="flex items-center justify-center gap-2 mt-6 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Tüm Ürünleri Gör
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/urunler/yeni"
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <Package className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold">Yeni Ürün Ekle</h3>
          <p className="text-blue-100 text-sm mt-1">Kataloga yeni ürün ekleyin</p>
        </Link>

        <Link
          href="/admin/siparisler"
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <ShoppingCart className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold">Siparişleri Yönet</h3>
          <p className="text-green-100 text-sm mt-1">Bekleyen siparişleri görüntüleyin</p>
        </Link>

        <Link
          href="/admin/kuponlar/yeni"
          className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow"
        >
          <DollarSign className="w-8 h-8 mb-4" />
          <h3 className="text-lg font-semibold">Kupon Oluştur</h3>
          <p className="text-purple-100 text-sm mt-1">Yeni indirim kuponu oluşturun</p>
        </Link>
      </div>
    </div>
  );
}
