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
    if (!selectedOrder) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Yazdırma penceresi açılamadı')
      return
    }

    const order = selectedOrder
    const statusLabel = statusLabels[order.status]
    const paymentStatusLabel = paymentStatusLabels[order.paymentStatus]
    
    const statusColors: Record<OrderStatus, {bg: string, color: string}> = {
      PENDING: {bg: '#fef3c7', color: '#92400e'},
      CONFIRMED: {bg: '#dbeafe', color: '#1e40af'},
      PROCESSING: {bg: '#e9d5ff', color: '#7c3aed'},
      SHIPPED: {bg: '#c7d2fe', color: '#3730a3'},
      DELIVERED: {bg: '#bbf7d0', color: '#166534'},
      CANCELLED: {bg: '#fecaca', color: '#991b1b'},
      REFUNDED: {bg: '#e5e7eb', color: '#374151'},
    }
    
    const paymentColors: Record<PaymentStatus, {bg: string, color: string}> = {
      PENDING: {bg: '#fef3c7', color: '#92400e'},
      PAID: {bg: '#bbf7d0', color: '#166534'},
      FAILED: {bg: '#fecaca', color: '#991b1b'},
      REFUNDED: {bg: '#e5e7eb', color: '#374151'},
      CANCELLED: {bg: '#fecaca', color: '#991b1b'},
    }

    const paymentMethodText = 
      order.paymentMethod === 'CREDIT_CARD' ? 'Kredi Kartı' :
      order.paymentMethod === 'BANK_TRANSFER' ? 'Havale/EFT' :
      order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Kapıda Ödeme' :
      order.paymentMethod || '-'

    const itemsHtml = order.items?.map(item => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 500; color: #111827;">${item.productName}</div>
          ${item.variantName ? `<div style="font-size: 12px; color: #6b7280; margin-top: 2px;">${item.variantName}</div>` : ''}
          <div style="font-size: 11px; color: #9ca3af; margin-top: 2px;">SKU: ${item.sku}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #4b5563;">₺${item.price.toLocaleString()}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 500; color: #111827;">₺${item.total.toLocaleString()}</td>
      </tr>
    `).join('') || ''

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Sipariş #${order.orderNumber}</title>
          <meta charset="UTF-8">
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
              font-size: 14px; 
              line-height: 1.5; 
              color: #374151; 
              background: #f3f4f6;
              padding: 20px;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              border-radius: 8px;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header { 
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
              color: white;
              padding: 30px;
            }
            .header h1 { 
              font-size: 28px; 
              font-weight: 700;
              margin-bottom: 8px;
            }
            .header-meta {
              opacity: 0.9;
              font-size: 14px;
            }
            .content {
              padding: 30px;
            }
            .section { 
              margin-bottom: 24px; 
            }
            .section-title {
              font-size: 12px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 12px;
            }
            .info-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 24px; 
            }
            .info-box {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
            }
            .info-box h3 {
              font-size: 14px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 12px;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .info-box p {
              font-size: 13px;
              color: #4b5563;
              margin-bottom: 6px;
            }
            .info-box p strong {
              color: #111827;
            }
            .status-row {
              display: flex;
              gap: 16px;
              margin-bottom: 24px;
            }
            .status-box {
              flex: 1;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 16px;
            }
            .status-label {
              font-size: 12px;
              color: #6b7280;
              margin-bottom: 8px;
            }
            .status-badge {
              display: inline-block;
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 13px;
              font-weight: 600;
            }
            .products-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              overflow: hidden;
            }
            .products-table th {
              background: #f3f4f6;
              padding: 12px;
              text-align: left;
              font-size: 11px;
              font-weight: 600;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .products-table th:last-child,
            .products-table td:last-child {
              text-align: right;
            }
            .products-table th:nth-child(2),
            .products-table td:nth-child(2) {
              text-align: center;
            }
            .totals {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin-top: 24px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .total-row.grand {
              font-size: 18px;
              font-weight: 700;
              color: #111827;
              border-top: 2px solid #e5e7eb;
              padding-top: 12px;
              margin-top: 12px;
            }
            .notes {
              background: #fef3c7;
              border: 1px solid #fcd34d;
              border-radius: 8px;
              padding: 16px;
              margin-bottom: 24px;
            }
            .notes h4 {
              font-size: 13px;
              font-weight: 600;
              color: #92400e;
              margin-bottom: 8px;
            }
            .notes p {
              font-size: 13px;
              color: #a16207;
            }
            .no-print { 
              text-align: center; 
              padding: 20px;
              background: #f3f4f6;
              border-top: 1px solid #e5e7eb;
            }
            .print-btn { 
              background: #2563eb; 
              color: white; 
              padding: 12px 32px; 
              border: none; 
              border-radius: 6px; 
              cursor: pointer; 
              font-size: 15px;
              font-weight: 500;
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }
            .print-btn:hover { 
              background: #1d4ed8; 
            }
            @media print {
              body { 
                background: white;
                padding: 0;
              }
              .container {
                box-shadow: none;
                max-width: 100%;
              }
              .no-print { 
                display: none !important; 
              }
              .header {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Sipariş #${order.orderNumber}</h1>
              <div class="header-meta">
                ${new Date(order.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            
            <div class="content">
              <!-- Durumlar -->
              <div class="status-row">
                <div class="status-box">
                  <div class="status-label">Sipariş Durumu</div>
                  <span class="status-badge" style="background: ${statusColors[order.status].bg}; color: ${statusColors[order.status].color};">
                    ${statusLabel}
                  </span>
                </div>
                <div class="status-box">
                  <div class="status-label">Ödeme Durumu</div>
                  <span class="status-badge" style="background: ${paymentColors[order.paymentStatus].bg}; color: ${paymentColors[order.paymentStatus].color};">
                    ${paymentStatusLabel}
                  </span>
                </div>
              </div>

              <!-- Müşteri ve Adres -->
              <div class="section">
                <div class="info-grid">
                  <div class="info-box">
                    <h3>👤 Müşteri Bilgileri</h3>
                    ${order.user ? `
                      <p><strong>Ad Soyad:</strong> ${order.user.firstName} ${order.user.lastName}</p>
                      <p><strong>Email:</strong> ${order.user.email}</p>
                      ${order.user.phone ? `<p><strong>Telefon:</strong> ${order.user.phone}</p>` : ''}
                    ` : `
                      <p><strong>Misafir Müşteri</strong></p>
                      <p><strong>Email:</strong> ${order.guestEmail || '-'}</p>
                      ${order.guestPhone ? `<p><strong>Telefon:</strong> ${order.guestPhone}</p>` : ''}
                    `}
                  </div>
                  
                  <div class="info-box">
                    <h3>📍 Teslimat Adresi</h3>
                    ${order.shippingAddress ? `
                      <p><strong>${order.shippingAddress.fullName || ''}</strong></p>
                      <p>${order.shippingAddress.address || ''}</p>
                      ${order.shippingAddress.addressLine2 ? `<p>${order.shippingAddress.addressLine2}</p>` : ''}
                      <p>${order.shippingAddress.district || ''} / ${order.shippingAddress.city || ''} ${order.shippingAddress.postalCode || ''}</p>
                      <p style="margin-top: 8px;"><strong>Telefon:</strong> ${order.shippingAddress.phone || '-'}</p>
                    ` : '<p>Adres bilgisi bulunamadı</p>'}
                  </div>
                </div>
              </div>

              <!-- Ödeme ve Kargo -->
              <div class="section">
                <div class="info-grid">
                  <div class="info-box">
                    <h3>💳 Ödeme Bilgileri</h3>
                    <p><strong>Ödeme Yöntemi:</strong> ${paymentMethodText}</p>
                    ${order.couponCode ? `<p><strong>Kupon Kodu:</strong> ${order.couponCode}</p>` : ''}
                  </div>
                  
                  <div class="info-box">
                    <h3>🚚 Kargo Bilgileri</h3>
                    ${order.trackingNumber ? `
                      <p><strong>Takip No:</strong> ${order.trackingNumber}</p>
                    ` : '<p>Henüz kargo bilgisi eklenmemiş</p>'}
                    ${order.shippedAt ? `<p><strong>Kargoya Verilme:</strong> ${new Date(order.shippedAt).toLocaleDateString('tr-TR')}</p>` : ''}
                    ${order.deliveredAt ? `<p><strong>Teslim Tarihi:</strong> ${new Date(order.deliveredAt).toLocaleDateString('tr-TR')}</p>` : ''}
                  </div>
                </div>
              </div>

              <!-- Notlar -->
              ${order.customerNote ? `
                <div class="notes">
                  <h4>📝 Müşteri Notu</h4>
                  <p>${order.customerNote}</p>
                </div>
              ` : ''}
              
              ${order.adminNote ? `
                <div class="notes" style="background: #dbeafe; border-color: #93c5fd;">
                  <h4 style="color: #1e40af;">👨‍💼 Admin Notu</h4>
                  <p style="color: #1e40af;">${order.adminNote}</p>
                </div>
              ` : ''}

              <!-- Ürünler -->
              <div class="section">
                <div class="section-title">Sipariş Ürünleri</div>
                <table class="products-table">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th style="text-align: center;">Adet</th>
                      <th style="text-align: right;">Birim Fiyat</th>
                      <th style="text-align: right;">Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
              </div>

              <!-- Toplam -->
              <div class="totals">
                <div class="total-row">
                  <span>Ara Toplam</span>
                  <span>₺${(order.subtotal || 0).toLocaleString()}</span>
                </div>
                <div class="total-row">
                  <span>Kargo Ücreti</span>
                  <span>${order.shippingCost === 0 ? 'Ücretsiz' : `₺${(order.shippingCost || 0).toLocaleString()}`}</span>
                </div>
                ${order.discountAmount > 0 ? `
                  <div class="total-row">
                    <span>İndirim</span>
                    <span style="color: #16a34a;">-₺${order.discountAmount.toLocaleString()}</span>
                  </div>
                ` : ''}
                <div class="total-row grand">
                  <span>Toplam</span>
                  <span>₺${order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div class="no-print">
              <button class="print-btn" onclick="window.print()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                Yazdır
              </button>
            </div>
          </div>
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
                    {order.customerNote && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-amber-600">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span>Not var</span>
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
