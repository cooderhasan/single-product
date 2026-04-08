'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Mail, ShoppingCart, Calendar, Eye, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
  createdAt: string;
  _count?: { orders: number };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Müşteriler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      
      // Filter to show only CUSTOMER role users
      const customerUsers = Array.isArray(data) 
        ? data.filter((user: User) => user.role === 'CUSTOMER')
        : data.users?.filter((user: User) => user.role === 'CUSTOMER') || [];
      
      setCustomers(customerUsers);
    } catch (error) {
      toast.error('Müşteriler yüklenirken bir hata oluştu');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      setDeletingId(id);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Müşteri silinirken bir hata oluştu');
      }

      toast.success('Müşteri başarıyla silindi');
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
    } catch (error) {
      toast.error('Müşteri silinirken bir hata oluştu');
      console.error('Error deleting customer:', error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  // Calculate stats
  const totalCustomers = customers.length;
  const thisMonthCustomers = customers.filter((c) => {
    const createdDate = new Date(c.createdAt);
    const now = new Date();
    return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
  }).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

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
          <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Yeni (Bu Ay)</p>
          <p className="text-2xl font-bold text-green-600">{thisMonthCustomers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Aktif</p>
          <p className="text-2xl font-bold text-blue-600">{totalCustomers}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Ort. Sipariş</p>
          <p className="text-2xl font-bold text-purple-600">
            {totalCustomers > 0 
              ? (customers.reduce((acc, c) => acc + (c._count?.orders || 0), 0) / totalCustomers).toFixed(1)
              : '0'}
          </p>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kayıt Tarihi</th>
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
                          {customer.firstName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {customer.id.slice(0, 8)}
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
                      {customer.phone && (
                        <div className="text-sm text-gray-600">{customer.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {customer._count?.orders || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
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
                      <button
                        onClick={() => handleDelete(customer.id)}
                        disabled={deletingId === customer.id}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingId === customer.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz müşteri bulunmuyor'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
