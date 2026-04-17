'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ChartBarIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  TagIcon,
  PhotoIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalOrders: number
  totalProducts: number
  totalUsers: number
  totalRevenue: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  user?: {
    firstName?: string
    lastName?: string
  }
  guestEmail?: string
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token')
    if (!token) {
      window.location.href = '/'
      return
    }
    
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,{
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?role=CUSTOMER`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      // API returns { products: [], total: 0 } or { orders: [], total: 0 }
      const productsData = productsRes.ok ? await productsRes.json() : { products: [], total: 0 };
      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [], total: 0 };
      const usersData = usersRes.ok ? await usersRes.json() : { users: [], total: 0 };

      if (!productsRes.ok) toast.error('Ürünler yüklenemedi');
      if (!ordersRes.ok) toast.error('Siparişler yüklenemedi');
      if (!usersRes.ok) toast.error('Müşteriler yüklenemedi');

      const products = Array.isArray(productsData.products) ? productsData.products : (Array.isArray(productsData) ? productsData : []);
      const orders = Array.isArray(ordersData.orders) ? ordersData.orders : (Array.isArray(ordersData) ? ordersData : []);
      const users = Array.isArray(usersData.users) ? usersData.users : [];

      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (Number(order.total) || 0), 0)

      setStats({
        totalOrders: orders.length || ordersData.total || 0,
        totalProducts: products.length || productsData.total || 0,
        totalUsers: users.length || usersData.total || 0,
        totalRevenue
      })

      // Get recent orders (first 5)
      setRecentOrders(orders.slice(0, 5))
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Veriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const statCards = [
    { 
      name: 'Toplam Sipariş', 
      value: stats.totalOrders, 
      icon: ShoppingCartIcon, 
      bgClass: 'bg-blue-50',
      iconClass: 'text-blue-600',
      href: '/orders'
    },
    { 
      name: 'Toplam Ürün', 
      value: stats.totalProducts, 
      icon: ShoppingBagIcon, 
      bgClass: 'bg-indigo-50',
      iconClass: 'text-indigo-600',
      href: '/products'
    },
    { 
      name: 'Toplam Müşteri', 
      value: stats.totalUsers, 
      icon: UsersIcon, 
      bgClass: 'bg-violet-50',
      iconClass: 'text-violet-600',
      href: '/customers'
    },
    { 
      name: 'Toplam Ciro', 
      value: `₺${stats.totalRevenue.toLocaleString()}`, 
      icon: CurrencyDollarIcon, 
      bgClass: 'bg-emerald-50',
      iconClass: 'text-emerald-600',
      href: '/orders'
    },
  ]

  const quickAccess = [
    { name: 'Yeni Ürün', href: '/products/new', icon: ShoppingBagIcon, baseColor: 'slate' },
    { name: 'Yeni Kategori', href: '/categories/new', icon: ChartBarIcon, baseColor: 'slate' },
    { name: 'Yeni Kupon', href: '/coupons/new', icon: TagIcon, baseColor: 'slate' },
    { name: 'Yeni Banner', href: '/banners/new', icon: PhotoIcon, baseColor: 'slate' },
    { name: 'Yeni Duyuru', href: '/duyurular/new', icon: MegaphoneIcon, baseColor: 'slate' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Dashboard Özeti</h1>
        <div className="text-sm text-slate-500 font-medium">Hoş Geldiniz</div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link 
            key={stat.name} 
            href={stat.href} 
            className="group block bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className={`${stat.bgClass} rounded-lg p-3 flex-shrink-0 transition-colors group-hover:scale-105 duration-200`}>
                <stat.icon className={`h-6 w-6 ${stat.iconClass}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-500 truncate">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Access */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4 tracking-tight">Hızlı Erişim</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {quickAccess.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex flex-col items-center justify-center p-5 bg-white border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <div className="p-3 rounded-full bg-slate-50 group-hover:bg-blue-100/50 mb-3 transition-colors">
                  <Icon className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Son Siparişler</h2>
          <Link href="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
            Tümünü Gör &rarr;
          </Link>
        </div>
        
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50/50 border-b border-gray-100">
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sipariş No</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Müşteri</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tarih</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tutar</th>
                  <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {order.user ? (
                        `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Bilinmeyen'
                      ) : (
                        order.guestEmail || 'Misafir'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      ₺{order.total.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-full ring-1 ring-inset ${
                        order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                        order.status === 'CANCELLED' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                        order.status === 'PENDING' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                        'bg-blue-50 text-blue-700 ring-blue-600/20'
                      }`}>
                        {order.status === 'PENDING' ? 'Bekliyor' :
                         order.status === 'CONFIRMED' ? 'Onaylandı' :
                         order.status === 'PROCESSING' ? 'İşleniyor' :
                         order.status === 'SHIPPED' ? 'Kargoda' :
                         order.status === 'DELIVERED' ? 'Teslim Edildi' :
                         order.status === 'CANCELLED' ? 'İptal' : 'İade'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-slate-500 text-sm">Henüz sipariş bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  )
}