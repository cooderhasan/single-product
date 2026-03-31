'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Package,
  XCircle,
} from 'lucide-react';

const orders = [
  {
    id: '1',
    orderNumber: 'SP-240315-001',
    customer: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    total: 8999,
    status: 'Tamamlandı',
    paymentStatus: 'Ödendi',
    date: '2024-03-15 14:30',
    items: 1,
  },
  {
    id: '2',
    orderNumber: 'SP-240315-002',
    customer: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    total: 12499,
    status: 'Kargoda',
    paymentStatus: 'Ödendi',
    date: '2024-03-15 11:20',
    items: 1,
  },
  {
    id: '3',
    orderNumber: 'SP-240314-003',
    customer: 'Ayşe Demir',
    email: 'ayse@example.com',
    total: 5499,
    status: 'Hazırlanıyor',
    paymentStatus: 'Ödendi',
    date: '2024-03-14 16:45',
    items: 1,
  },
  {
    id: '4',
    orderNumber: 'SP-240314-004',
    customer: 'Fatma Şahin',
    email: 'fatma@example.com',
    total: 18999,
    status: 'Tamamlandı',
    paymentStatus: 'Ödendi',
    date: '2024-03-14 09:15',
    items: 2,
  },
  {
    id: '5',
    orderNumber: 'SP-240313-005',
    customer: 'Ali Yıldız',
    email: 'ali@example.com',
    total: 7499,
    status: 'Bekliyor',
    paymentStatus: 'Bekliyor',
    date: '2024-03-13 13:00',
    items: 1,
  },
];

const statusColors: Record<string, string> = {
  'Tamamlandı': 'bg-green-100 text-green-800',
  'Kargoda': 'bg-blue-100 text-blue-800',
  'Hazırlanıyor': 'bg-yellow-100 text-yellow-800',
  'Bekliyor': 'bg-gray-100 text-gray-800',
  'İptal Edildi': 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<string, string> = {
  'Ödendi': 'bg-green-100 text-green-800',
  'Bekliyor': 'bg-yellow-100 text-yellow-800',
  'Başarısız': 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Siparişler</h1>
          <p className="text-gray-500">Tüm siparişleri yönetin</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Yeni</p>
              <p className="text-xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Hazırlanıyor</p>
              <p className="text-xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Kargoda</p>
              <p className="text-xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tamamlandı</p>
              <p className="text-xl font-bold text-gray-900">142</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş no, müşteri ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tüm Durumlar</option>
              <option value="Bekliyor">Bekliyor</option>
              <option value="Hazırlanıyor">Hazırlanıyor</option>
              <option value="Kargoda">Kargoda</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="İptal Edildi">İptal Edildi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sipariş No</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Müşteri</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tutar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.items} ürün</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.total.toLocaleString('tr-TR')} ₺
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${paymentStatusColors[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/siparisler/${order.id}`}
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

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Sipariş bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
