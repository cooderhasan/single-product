'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Mail, ShoppingCart, Calendar, Eye } from 'lucide-react';

const customers = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    phone: '0555 123 45 67',
    orderCount: 5,
    totalSpent: 45000,
    lastOrder: '2024-03-15',
    registeredAt: '2023-12-01',
  },
  {
    id: '2',
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    phone: '0555 234 56 78',
    orderCount: 3,
    totalSpent: 28000,
    lastOrder: '2024-03-10',
    registeredAt: '2024-01-15',
  },
  {
    id: '3',
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    phone: '0555 345 67 89',
    orderCount: 8,
    totalSpent: 72000,
    lastOrder: '2024-03-14',
    registeredAt: '2023-10-20',
  },
  {
    id: '4',
    name: 'Fatma Şahin',
    email: 'fatma@example.com',
    phone: '0555 456 78 90',
    orderCount: 2,
    totalSpent: 15000,
    lastOrder: '2024-02-28',
    registeredAt: '2024-02-01',
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Müşteriler</h1>
          <p className="text-gray-500">Tüm müşterileri görüntüleyin ve yönetin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Toplam Müşteri</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Yeni (Bu Ay)</p>
          <p className="text-2xl font-bold text-green-600">12</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="text-2xl font-bold text-blue-600">89</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Ort. Sipariş</p>
          <p className="text-2xl font-bold text-purple-600">4.2</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Müşteri ara (isim, email, telefon)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İletişim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siparişler</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Toplam Harcama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Son Sipariş</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">
                          Üyelik: {new Date(customer.registeredAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      <div className="text-sm text-gray-600">{customer.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{customer.orderCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {customer.totalSpent.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(customer.lastOrder).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/musteriler/${customer.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Müşteri bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
