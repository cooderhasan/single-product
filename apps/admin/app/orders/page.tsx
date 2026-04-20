'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import {
  EyeIcon,
  MagnifyingGlassIcon,
  TruckIcon,
  CheckCircleIcon,
  XMarkIcon,
  PrinterIcon,
  MapPinIcon,
  UserIcon,
  CreditCardIcon,
  CalendarIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline'

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED'

interface OrderItem {
  id: string
  productName: string
  variantName?: string
  sku: string
  quantity: number
  price: number
  total: number
  product?: {
    name: string
    images?: string[]
  }
}

interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  total: number
  subtotal: number
  shippingCost: number
  discountAmount: number
  createdAt: string
  shippedAt?: string
  deliveredAt?: string
  user?: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }
  guestEmail?: string
  guestPhone?: string
  trackingNumber?: string
  customerNote?: string
  adminNote?: string
  shippingAddress?: any
  billingAddress?: any
  paymentMethod?: string
  couponCode?: string
  items?: OrderItem[]
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Bekliyor',
  CONFIRMED: 'Onaylandı',
  PROCESSING: 'İşleniyor',
  SHIPPED: 'Kargoda',
  DELIVERED: 'Teslim Edildi',
  CANCELLED: 'İptal Edildi',
  REFUNDED: 'İade Edildi',
}

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
}

const paymentStatusLabels: Record<PaymentStatus, string> = {
  PENDING: 'Bekliyor',
  PAID: 'Ödendi',
  FAILED: 'Başarısız',
  REFUNDED: 'İade Edildi',
  CANCELLED: 'İptal Edildi',
}

const paymentStatusColors: Record<PaymentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Orders fetch error:', error)
      toast.error('Siparişler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Sipariş durumu güncellendi')
        fetchOrders()
      } else {
        throw new Error('Güncelleme başarısız')
      }
    } catch (error) {
      toast.error('Durum güncellenirken hata oluştu')
    }
  }

  console.log('Rendering with orders:', orders);

  const filteredOrders = Array.isArray(orders) ? orders : [];

  const fetchOrderDetail = async (orderId: string) => {
    setDetailLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSelectedOrder(data)
      } else {
        toast.error('Sipariş detayı yüklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Order detail fetch error:', error)
      toast.error('Sipariş detayı yüklenirken hata oluştu')
    } finally {
      setDetailLoading(false)
    }
  }

  const handlePrint = () => {
    if (!printRef.current) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Yazdırma penceresi açılamadı')
      return
    }

    const printContent = printRef.current.innerHTML
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sipariş #${selectedOrder?.orderNumber}</title>
          <meta charset="UTF-8">
          <style>
            @media print {
              body { font-family: Arial, sans-serif; margin: 20px; }
              .no-print { display: none !important; }
            }
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; color: #666; }
            .section { margin-bottom: 30px; }
            .section h2 { font-size: 16px; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .info-item { margin-bottom: 10px; }
            .info-label { font-weight: bold; color: #666; font-size: 12px; }
            .info-value { font-size: 14px; margin-top: 3px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .text-right { text-align: right; }
            .total-section { margin-top: 30px; border-top: 2px solid #333; padding-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .total-row.grand { font-size: 18px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px; }
            .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
            .status-PENDING { background: #fef3c7; color: #92400e; }
            .status-CONFIRMED { background: #dbeafe; color: #1e40af; }
            .status-PROCESSING { background: #e9d5ff; color: #7c3aed; }
            .status-SHIPPED { background: #c7d2fe; color: #3730a3; }
            .status-DELIVERED { background: #bbf7d0; color: #166534; }
            .status-CANCELLED { background: #fecaca; color: #991b1b; }
            .status-REFUNDED { background: #e5e7eb; color: #374151; }
            .no-print { margin: 20px 0; text-align: center; }
            .print-btn { background: #2563eb; color: white; padding: 12px 30px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }
            .print-btn:hover { background: #1d4ed8; }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="print-btn" onclick="window.print()">🖨️ Yazdır</button>
          </div>
          ${printContent}
        </body>
      </html>
    `)
    printWindow.document.close()
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Sipariş Yönetimi</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Sipariş no veya email ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tüm Durumlar</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sipariş No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ödeme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {order.user ? (
                      <div>
                        <div>{order.user.firstName} {order.user.lastName}</div>
                        <div className="text-xs text-gray-400">{order.user.email}</div>
                      </div>
                    ) : (
                      <div>
                        <div>Misafir</div>
                        <div className="text-xs text-gray-400">{order.guestEmail}</div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ₺{order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStatusColors[order.paymentStatus]}`}>
                      {paymentStatusLabels[order.paymentStatus]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${statusColors[order.status]}`}
                    >
                      {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => fetchOrderDetail(order.id)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Detay"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      {order.status === 'SHIPPED' && order.trackingNumber && (
                        <button
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Kargo Takip"
                        >
                          <TruckIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">Henüz sipariş bulunmamaktadır.</p>
          </div>
        )}
      </div>

      {/* Sipariş Detay Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Sipariş #{selectedOrder.orderNumber}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedOrder.createdAt).toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PrinterIcon className="h-5 w-5" />
                  Yazdır
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {detailLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div ref={printRef} className="space-y-6">
                  {/* Print Header - Sadece yazdırma için */}
                  <div className="hidden print:block mb-8">
                    <h1 className="text-3xl font-bold">Sipariş #{selectedOrder.orderNumber}</h1>
                    <p className="text-gray-600 mt-2">
                      Tarih: {new Date(selectedOrder.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>

                  {/* Durumlar */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <ShoppingBagIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">Sipariş Durumu</span>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusColors[selectedOrder.status]}`}>
                        {statusLabels[selectedOrder.status]}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <CreditCardIcon className="h-5 w-5" />
                        <span className="text-sm font-medium">Ödeme Durumu</span>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${paymentStatusColors[selectedOrder.paymentStatus]}`}>
                        {paymentStatusLabels[selectedOrder.paymentStatus]}
                      </span>
                    </div>
                  </div>

                  {/* Müşteri Bilgileri */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-700 mb-3">
                        <UserIcon className="h-5 w-5" />
                        <h3 className="font-semibold">Müşteri Bilgileri</h3>
                      </div>
                      {selectedOrder.user ? (
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Ad Soyad:</span> {selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
                          <p><span className="font-medium">Email:</span> {selectedOrder.user.email}</p>
                          {selectedOrder.user.phone && (
                            <p><span className="font-medium">Telefon:</span> {selectedOrder.user.phone}</p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Misafir Müşteri</span></p>
                          <p><span className="font-medium">Email:</span> {selectedOrder.guestEmail}</p>
                          {selectedOrder.guestPhone && (
                            <p><span className="font-medium">Telefon:</span> {selectedOrder.guestPhone}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-gray-700 mb-3">
                        <MapPinIcon className="h-5 w-5" />
                        <h3 className="font-semibold">Teslimat Adresi</h3>
                      </div>
                      {selectedOrder.shippingAddress ? (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                          <p>{selectedOrder.shippingAddress.address}</p>
                          {selectedOrder.shippingAddress.addressLine2 && (
                            <p>{selectedOrder.shippingAddress.addressLine2}</p>
                          )}
                          <p>{selectedOrder.shippingAddress.district} / {selectedOrder.shippingAddress.city}</p>
                          <p>{selectedOrder.shippingAddress.postalCode}</p>
                          <p className="mt-2">
                            <span className="font-medium">Telefon:</span> {selectedOrder.shippingAddress.phone}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Adres bilgisi bulunamadı</p>
                      )}
                    </div>
                  </div>

                  {/* Ödeme ve Kargo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-700 mb-3">Ödeme Bilgileri</h3>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="font-medium">Ödeme Yöntemi:</span>{' '}
                          {selectedOrder.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' :
                           selectedOrder.paymentMethod === 'BANK_TRANSFER' ? 'Havale/EFT' :
                           selectedOrder.paymentMethod === 'CASH_ON_DELIVERY' ? 'Kapıda Ödeme' :
                           selectedOrder.paymentMethod}
                        </p>
                        {selectedOrder.couponCode && (
                          <p><span className="font-medium">Kupon Kodu:</span> {selectedOrder.couponCode}</p>
                        )}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-700 mb-3">Kargo Bilgileri</h3>
                      <div className="space-y-2 text-sm">
                        {selectedOrder.trackingNumber ? (
                          <p><span className="font-medium">Kargo Takip No:</span> {selectedOrder.trackingNumber}</p>
                        ) : (
                          <p className="text-gray-500">Henüz kargo bilgisi eklenmemiş</p>
                        )}
                        {selectedOrder.shippedAt && (
                          <p>
                            <span className="font-medium">Kargoya Verilme:</span>{' '}
                            {new Date(selectedOrder.shippedAt).toLocaleDateString('tr-TR')}
                          </p>
                        )}
                        {selectedOrder.deliveredAt && (
                          <p>
                            <span className="font-medium">Teslim Tarihi:</span>{' '}
                            {new Date(selectedOrder.deliveredAt).toLocaleDateString('tr-TR')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sipariş Notları */}
                  {selectedOrder.customerNote && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-semibold text-yellow-800 mb-2">Müşteri Notu</h3>
                      <p className="text-sm text-yellow-700">{selectedOrder.customerNote}</p>
                    </div>
                  )}

                  {selectedOrder.adminNote && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-blue-800 mb-2">Admin Notu</h3>
                      <p className="text-sm text-blue-700">{selectedOrder.adminNote}</p>
                    </div>
                  )}

                  {/* Sipariş Ürünleri */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <h3 className="font-semibold text-gray-700 p-4 bg-gray-50 border-b border-gray-200">Sipariş Ürünleri</h3>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Adet</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Birim Fiyat</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Toplam</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items?.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                              {item.variantName && (
                                <div className="text-xs text-gray-500">{item.variantName}</div>
                              )}
                              <div className="text-xs text-gray-400">SKU: {item.sku}</div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm text-gray-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-sm text-gray-600">₺{item.price.toLocaleString()}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">₺{item.total.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Fiyat Özeti */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ara Toplam</span>
                      <span className="font-medium">₺{selectedOrder.subtotal?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Kargo Ücreti</span>
                      <span className="font-medium">
                        {selectedOrder.shippingCost === 0 ? 'Ücretsiz' : `₺${selectedOrder.shippingCost?.toLocaleString()}`}
                      </span>
                    </div>
                    {selectedOrder.discountAmount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">İndirim</span>
                        <span className="font-medium text-green-600">-₺{selectedOrder.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2">
                      <span>Toplam</span>
                      <span>₺{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
