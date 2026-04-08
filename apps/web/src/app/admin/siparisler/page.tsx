'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  Loader2,
  ChevronDown,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  total: number;
  createdAt: string;
  user?: { firstName: string; lastName: string; email: string };
  guestEmail?: string;
}

type OrderStatus = Order['status'];

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Bekliyor',
  CONFIRMED: 'Onaylandı',
  PROCESSING: 'Hazırlanıyor',
  SHIPPED: 'Kargoda',
  DELIVERED: 'Tamamlandı',
  CANCELLED: 'İptal Edildi',
  REFUNDED: 'İade Edildi',
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: 'Bekliyor',
  PAID: 'Ödendi',
  FAILED: 'Başarısız',
  REFUNDED: 'İade Edildi',
  CANCELLED: 'İptal Edildi',
};

const statusColors: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-800',
  SHIPPED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  PENDING: 'bg-gray-100 text-gray-800',
  CONFIRMED: 'bg-purple-100 text-purple-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-orange-100 text-orange-800',
};

const paymentStatusColors: Record<string, string> = {
  PAID: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-orange-100 text-orange-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
};

const statusFilterOptions = [
  { value: '', label: 'Tüm Durumlar' },
  { value: 'PENDING', label: 'Bekliyor' },
  { value: 'CONFIRMED', label: 'Onaylandı' },
  { value: 'PROCESSING', label: 'Hazırlanıyor' },
  { value: 'SHIPPED', label: 'Kargoda' },
  { value: 'DELIVERED', label: 'Tamamlandı' },
  { value: 'CANCELLED', label: 'İptal Edildi' },
  { value: 'REFUNDED', label: 'İade Edildi' },
];

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  useEffect(() => {
    toasts.forEach((toast) => {
      setTimeout(() => onRemove(toast.id), 3000);
    });
  }, [toasts, onRemove]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Siparişler yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      // API response can be: array, {data: array}, {orders: array}, or {orders: {orders: array}}
      let ordersList = [];
      if (Array.isArray(data)) {
        ordersList = data;
      } else if (Array.isArray(data.data)) {
        ordersList = data.data;
      } else if (Array.isArray(data.orders)) {
        ordersList = data.orders;
      } else if (data.orders && Array.isArray(data.orders.orders)) {
        ordersList = data.orders.orders;
      }
      setOrders(ordersList);
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Siparişler yüklenemedi', 'error');
      setOrders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderId}/status`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error('Durum güncellenirken bir hata oluştu');
      }

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      addToast('Sipariş durumu güncellendi', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Durum güncellenemedi', 'error');
    } finally {
      setUpdatingOrderId(null);
      setShowStatusDropdown(null);
    }
  };

  const getCustomerName = (order: Order) => {
    if (order.user) {
      return `${order.user.firstName} ${order.user.lastName}`;
    }
    return 'Misafir Müşteri';
  };

  const getCustomerEmail = (order: Order) => {
    return order.user?.email || order.guestEmail || '-';
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(order).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerEmail(order).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  const getStatusCount = (status: OrderStatus) => {
    return Array.isArray(orders) ? orders.filter((o) => o.status === status).length : 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowStatusDropdown(null);
    if (showStatusDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showStatusDropdown]);

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

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
              <p className="text-sm text-gray-500">Bekliyor</p>
              <p className="text-xl font-bold text-gray-900">{getStatusCount('PENDING')}</p>
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
              <p className="text-xl font-bold text-gray-900">{getStatusCount('PROCESSING')}</p>
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
              <p className="text-xl font-bold text-gray-900">{getStatusCount('SHIPPED')}</p>
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
              <p className="text-xl font-bold text-gray-900">{getStatusCount('DELIVERED')}</p>
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
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <span className="ml-3 text-gray-500">Yükleniyor...</span>
            </div>
          ) : (
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
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{getCustomerName(order)}</p>
                      <p className="text-xs text-gray-500">{getCustomerEmail(order)}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.total.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowStatusDropdown(showStatusDropdown === order.id ? null : order.id);
                          }}
                          disabled={updatingOrderId === order.id}
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusColors[order.status]} ${
                            updatingOrderId === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'
                          }`}
                        >
                          {updatingOrderId === order.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : null}
                          {statusLabels[order.status]}
                          <ChevronDown className="w-3 h-3" />
                        </button>

                        {showStatusDropdown === order.id && (
                          <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            {(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'] as OrderStatus[]).map(
                              (status) => (
                                <button
                                  key={status}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateOrderStatus(order.id, status);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                                    order.status === status ? 'bg-gray-50 font-medium' : ''
                                  }`}
                                >
                                  {statusLabels[status]}
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${paymentStatusColors[order.paymentStatus]}`}
                      >
                        {paymentStatusLabels[order.paymentStatus] || order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.createdAt)}</td>
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
          )}
        </div>

        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Sipariş bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  );
}
