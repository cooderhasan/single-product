'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Order, Product, User } from '@/types';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
}

interface StatsCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: typeof DollarSign;
  color: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StatsCard[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sales: number; revenue: number }[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard stats, product count, customer count, recent orders, and top products in parallel
      const [
        statsRes,
        productsRes,
        usersRes,
        ordersRes,
      ] = await Promise.allSettled([
        api.get('/orders/dashboard/stats'),
        api.get('/products', { params: { take: 1 } }),
        api.get('/users', { params: { take: 1 } }),
        api.get('/orders', { params: { take: 5, skip: 0 } }),
      ]);

      // Process dashboard stats
      let dashboardStats: DashboardStats | null = null;
      if (statsRes.status === 'fulfilled') {
        dashboardStats = statsRes.value.data;
      } else {
        toast.error('İstatistikler yüklenirken hata oluştu');
        console.error('Stats error:', statsRes.reason);
      }

      // Process product count
      let productCount = 0;
      if (productsRes.status === 'fulfilled') {
        const productsData = productsRes.value.data;
        productCount = productsData.meta?.total || productsData.data?.length || 0;
      } else {
        toast.error('Ürün sayısı yüklenirken hata oluştu');
        console.error('Products error:', productsRes.reason);
      }

      // Process customer count
      let customerCount = 0;
      if (usersRes.status === 'fulfilled') {
        const usersData = usersRes.value.data;
        customerCount = usersData.meta?.total || usersData.data?.length || 0;
      } else {
        toast.error('Müşteri sayısı yüklenirken hata oluştu');
        console.error('Users error:', usersRes.reason);
      }

      // Process recent orders
      if (ordersRes.status === 'fulfilled') {
        const ordersData = ordersRes.value.data;
        setRecentOrders(ordersData.data || ordersData || []);
      } else {
        toast.error('Son siparişler yüklenirken hata oluştu');
        console.error('Orders error:', ordersRes.reason);
      }

      // Build stats cards
      const calculatedStats: StatsCard[] = [
        {
          title: 'Toplam Ciro',
          value: dashboardStats
            ? `₺${dashboardStats.totalRevenue.toLocaleString('tr-TR')}`
            : '₺0',
          change: '+12.5%',
          trend: 'up',
          icon: DollarSign,
          color: 'bg-blue-500',
        },
        {
          title: 'Siparişler',
          value: dashboardStats
            ? dashboardStats.totalOrders.toLocaleString('tr-TR')
            : '0',
          change: '+8.2%',
          trend: 'up',
          icon: ShoppingCart,
          color: 'bg-green-500',
        },
        {
          title: 'Müşteriler',
          value: customerCount.toLocaleString('tr-TR'),
          change: '+15.3%',
          trend: 'up',
          icon: Users,
          color: 'bg-purple-500',
        },
        {
          title: 'Ürünler',
          value: productCount.toLocaleString('tr-TR'),
          change: '-2.1%',
          trend: 'down',
          icon: Package,
          color: 'bg-orange-500',
        },
      ];
      setStats(calculatedStats);

      // Fetch top products (mock data for now, can be replaced with real endpoint)
      setTopProducts([
        { name: 'Hidrolik Motosiklet Sehpası Pro', sales: 45, revenue: 404955 },
        { name: 'Hidrolik Sehpa Super Pro', sales: 32, revenue: 399968 },
        { name: 'Manuel Motosiklet Sehpası Ekonomik', sales: 28, revenue: 153972 },
      ]);
    } catch (error) {
      toast.error('Dashboard verileri yüklenirken hata oluştu');
      console.error('Dashboard error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'Tamamlandı':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
      case 'Kargoda':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
      case 'Hazırlanıyor':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
      case 'Bekliyor':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: 'Bekliyor',
      PROCESSING: 'Hazırlanıyor',
      SHIPPED: 'Kargoda',
      COMPLETED: 'Tamamlandı',
      CANCELLED: 'İptal Edildi',
    };
    return statusMap[status] || status;
  };

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
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.shippingAddress?.fullName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{order.total.toLocaleString('tr-TR')} ₺</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Henüz sipariş bulunmuyor
                    </td>
                  </tr>
                )}
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
