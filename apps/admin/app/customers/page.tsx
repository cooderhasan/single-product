'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

type UserRole = 'CUSTOMER' | 'ADMIN' | 'MANAGER'

interface Customer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role: UserRole
  createdAt: string
  _count: {
    orders: number
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const queryParams = new URLSearchParams()
      if (roleFilter) queryParams.append('role', roleFilter)
      if (searchQuery) queryParams.append('search', searchQuery)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.users)
      }
    } catch (error) {
      console.error('Customers fetch error:', error)
      toast.error('Müşteriler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success('Müşteri başarıyla silindi')
        setCustomers(customers.filter(c => c.id !== id))
      } else {
        throw new Error('Silme işlemi başarısız')
      }
    } catch (error) {
      toast.error('Müşteri silinirken hata oluştu')
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchQuery === '' || 
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.firstName && customer.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (customer.lastName && customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Müşteri Yönetimi</h1>
        <Link
          href="/customers/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Yeni Müşteri
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Müşteri ara (email, isim, soyisim)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tüm Roller</option>
            <option value="CUSTOMER">Müşteri</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Yönetici</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş Sayısı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserCircleIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.firstName || customer.lastName 
                            ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
                            : 'İsim Belirtilmemiş'
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.phone || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[customer.role]}`}>
                      {roleLabels[customer.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer._count.orders}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/customers/${customer.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Detay"
                      >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/customers/edit/${customer.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Düzenle"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Sil"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Henüz müşteri bulunmamaktadır.</p>
            <Link
              href="/customers/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              İlk Müşteriyi Ekle
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}