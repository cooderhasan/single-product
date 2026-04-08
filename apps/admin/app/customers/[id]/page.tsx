'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import {
  ShoppingCartIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER'

interface Address {
  id: string
  title: string
  fullName: string
  phone: string
  city: string
  district: string
  address: string
  isDefault: boolean
}

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
}

interface Customer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role: UserRole
  createdAt: string
  addresses: Address[]
}

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string
  
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomer()
    fetchCustomerOrders()
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        setCustomer(await response.json())
      } else {
        toast.error('Müşteri bilgileri yüklenemedi')
        window.location.href = '/customers'
      }
    } catch (error) {
      console.error('Fetch customer error:', error)
      toast.error('Müşteri bilgileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerOrders = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders?userId=${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        setOrders(await response.json())
      }
    } catch (error) {
      console.error('Fetch customer orders error:', error)
    }
  }

  const roleLabels: Record<UserRole, string> = {
    CUSTOMER: 'Müşteri',
    ADMIN: 'Admin',
    MANAGER: 'Yönetici',
  }

  const roleColors: Record<UserRole, string> = {
    CUSTOMER: 'bg-blue-100 text-blue-800',
    ADMIN: 'bg-purple-100 text-purple-800',
    MANAGER: 'bg-green-100 text-green-800',
  }

  const statusLabels: Record<string, string> = {
    PENDING: 'Bekliyor',
    CONFIRMED: 'Onaylandı',
    PROCESSING: 'İşleniyor',
    SHIPPED: 'Kargoda',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal Edildi',
    REFUNDED: 'İade Edildi',
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  }

  if (loading || !customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              href="/customers"
              className="p-2 text-gray-400 hover:text-gray-600 mr-2"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Müşteri Detayları
            </h1>
          </div>
          <Link
            href={`/customers/edit/${customer.id}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Düzenle
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ad</label>
                    <p className="mt-1 text-gray-900">{customer.firstName || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Soyad</label>
                    <p className="mt-1 text-gray-900">{customer.lastName || '-'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{customer.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Telefon</label>
                    <p className="mt-1 text-gray-900">{customer.phone || '-'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                    <span className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${roleColors[customer.role]}`}>
                      {roleLabels[customer.role]}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kayıt Tarihi</label>
                    <p className="mt-1 text-gray-900 flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(customer.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Sipariş Geçmişi</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <ShoppingCartIcon className="h-4 w-4 mr-1" />
                  Toplam {orders.length} sipariş
                </div>
              </div>
              
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
                    return (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Sipariş No</p>
                            <Link 
                              href={`/orders/${order.id}`}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              {order.orderNumber}
                            </Link>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tutar</p>
                            <p className="text-sm font-medium text-gray-900">₺{order.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Durum</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.status]}`}>
                              {statusLabels[order.status] || order.status}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Tarih</p>
                            <p className="text-sm text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <ShoppingCartIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Henüz sipariş bulunmamaktadır.</p>
                </div>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Adresler</h2>
            
            {customer.addresses && customer.addresses.length > 0 ? (
              <div className="space-y-3">
                {customer.addresses.map((address) => (
                  <div key={address.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{address.title}</span>
                          {address.isDefault && (
                            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Varsayılan
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{address.fullName}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address}, {address.district}, {address.city}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <MapPinIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Kayıtlı adres bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}