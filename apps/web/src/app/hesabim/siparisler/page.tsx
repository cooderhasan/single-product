'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, Truck, CheckCircle, Clock } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Order } from '@/types';

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  PENDING: { label: 'Bekliyor', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  PROCESSING: { label: 'Hazırlanıyor', color: 'bg-blue-100 text-blue-800', icon: Package },
  SHIPPED: { label: 'Kargoda', color: 'bg-purple-100 text-purple-800', icon: Truck },
  DELIVERED: { label: 'Teslim Edildi', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'İptal Edildi', color: 'bg-red-100 text-red-800', icon: CheckCircle },
};

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/giris');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      // API entegrasyonu burada yapılacak
      // Şimdilik demo veri
      setOrders([
        {
          id: '1',
          orderNumber: 'SP-240315-001',
          status: 'DELIVERED',
          paymentStatus: 'PAID',
          subtotal: 8999,
          shippingCost: 0,
          discountAmount: 0,
          total: 8999,
          items: [
            {
              id: '1',
              product: {} as any,
              productName: 'Hidrolik Motosiklet Sehpası Pro',
              sku: 'HYD-PRO-001',
              price: 8999,
              quantity: 1,
              total: 8999,
            },
          ],
          shippingAddress: {} as any,
          billingAddress: {} as any,
          paymentMethod: 'CREDIT_CARD',
          createdAt: '2024-03-15T10:30:00Z',
        },
        {
          id: '2',
          orderNumber: 'SP-240320-002',
          status: 'SHIPPED',
          paymentStatus: 'PAID',
          subtotal: 12499,
          shippingCost: 0,
          discountAmount: 1000,
          total: 11499,
          items: [
            {
              id: '2',
              product: {} as any,
              productName: 'Hidrolik Sehpa Super Pro',
              sku: 'HYD-SUPER-001',
              price: 12499,
              quantity: 1,
              total: 12499,
            },
          ],
          shippingAddress: {} as any,
          billingAddress: {} as any,
          paymentMethod: 'CREDIT_CARD',
          createdAt: '2024-03-20T14:20:00Z',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Siparişlerim</h1>
          <p className="text-gray-600">Siparişlerinizi takip edin</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Siparişler yükleniyor...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Henüz Siparişiniz Yok</h2>
            <p className="text-gray-600 mb-6">Ürünleri keşfedin ve ilk siparişinizi verin!</p>
            <Link
              href="/urunler"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusMap[order.status] || statusMap.PENDING;
              const StatusIcon = status.icon;

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Sipariş No</p>
                        <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Sipariş Tarihi</p>
                        <p className="text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Toplam</p>
                        <p className="font-semibold text-primary-600">
                          {order.total.toLocaleString('tr-TR')} ₺
                        </p>
                      </div>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.productName}</h3>
                          <p className="text-sm text-gray-500">{item.sku}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.quantity} adet x {item.price.toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {order.items.length} ürün
                    </div>
                    <Link
                      href={`/hesabim/siparisler/${order.id}`}
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Detayları Gör
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
