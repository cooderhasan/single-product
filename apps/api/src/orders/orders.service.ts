import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, OrderStatus, PaymentStatus } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';
import { v4 as uuidv4 } from 'uuid';

export interface CreateOrderData {
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  couponCode?: string;
  customerNote?: string;
}

@Injectable()
export class OrdersService {
  async findAll(params: {
    skip?: number;
    take?: number;
    status?: OrderStatus;
    userId?: string;
  }) {
    const { skip = 0, take = 20, status, userId } = params;

    const where: Prisma.OrderWhereInput = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: { name: true, images: { take: 1 } },
              },
            },
          },
          user: {
            select: { email: true, firstName: true, lastName: true, phone: true },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async findById(id: string, userId?: string) {
    const where: Prisma.OrderWhereUniqueInput = { id };
    
    const order = await prisma.order.findUnique({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: { email: true, firstName: true, lastName: true, phone: true },
        },
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı');
    }

    // Kullanıcı sadece kendi siparişini görebilir
    if (userId && order.userId !== userId) {
      throw new NotFoundException('Sipariş bulunamadı');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı');
    }

    return order;
  }

  async create(data: CreateOrderData) {
    const orderNumber = this.generateOrderNumber();

    // Ürünleri ve fiyatları hesapla
    let subtotal = 0;
    const orderItems = [];

    for (const item of data.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product) {
        throw new BadRequestException(`Ürün bulunamadı: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Yetersiz stok: ${product.name}`);
      }

      let price = Number(product.price);
      let variantName = '';

      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (!variant) {
          throw new BadRequestException(`Varyant bulunamadı: ${item.variantId}`);
        }
        price = Number(variant.price);
        variantName = variant.name;
      }

      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        variantName,
        productName: product.name,
        sku: product.sku,
        price,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // Kupon kontrolü
    let discountAmount = 0;
    let couponId = null;

    if (data.couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: data.couponCode.toUpperCase() },
      });

      if (coupon && coupon.isActive && coupon.startDate <= new Date()) {
        if (!coupon.endDate || coupon.endDate >= new Date()) {
          if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
            if (!coupon.minOrderAmount || subtotal >= Number(coupon.minOrderAmount)) {
              if (coupon.type === 'PERCENTAGE') {
                discountAmount = subtotal * (Number(coupon.value) / 100);
                if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
                  discountAmount = Number(coupon.maxDiscount);
                }
              } else if (coupon.type === 'FIXED_AMOUNT') {
                discountAmount = Number(coupon.value);
              }
              couponId = coupon.id;

              // Kupon kullanım sayısını artır
              await prisma.coupon.update({
                where: { id: coupon.id },
                data: { usageCount: { increment: 1 } },
              });
            }
          }
        }
      }
    }

    // Kargo ücreti
    const shippingCost = subtotal >= 1000 ? 0 : 75;

    // Toplam
    const total = subtotal + shippingCost - discountAmount;

    // Sipariş oluştur
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        shippingCost,
        discountAmount,
        total,
        couponId,
        couponCode: data.couponCode?.toUpperCase(),
        shippingAddress: data.shippingAddress,
        billingAddress: data.billingAddress,
        paymentMethod: data.paymentMethod as any,
        customerNote: data.customerNote,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Stok düş
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          salesCount: { increment: item.quantity },
        },
      });
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus, adminNote?: string) {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Sipariş bulunamadı');
    }

    const updateData: Prisma.OrderUpdateInput = { status };
    
    if (adminNote) {
      updateData.adminNote = adminNote;
    }

    if (status === OrderStatus.SHIPPED) {
      updateData.shippedAt = new Date();
    }

    if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = new Date();
    }

    return prisma.order.update({
      where: { id },
      data: updateData,
    });
  }

  async updatePaymentStatus(id: string, status: PaymentStatus) {
    return prisma.order.update({
      where: { id },
      data: { paymentStatus: status },
    });
  }

  async getDashboardStats() {
    const [
      totalOrders,
      totalRevenue,
      todayOrders,
      todayRevenue,
      pendingOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: PaymentStatus.PAID },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          paymentStatus: PaymentStatus.PAID,
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.order.count({
        where: { status: OrderStatus.PENDING },
      }),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      todayOrders,
      todayRevenue: todayRevenue._sum.total || 0,
      pendingOrders,
    };
  }

  private generateOrderNumber(): string {
    const prefix = 'SP';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
