import { Injectable } from '@nestjs/common';
import { PaymentStatus, OrderStatus } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class PaymentsService {
  constructor(private ordersService: OrdersService) {}

  async createPayment(data: {
    orderId: string;
    merchantOid?: string;
    paymentAmount: number;
    status: string;
    paytrResponse?: any;
  }) {
    return prisma.payment.create({
      data: {
        orderId: data.orderId,
        merchantOid: data.merchantOid,
        paymentAmount: data.paymentAmount,
        status: data.status,
        paytrResponse: data.paytrResponse,
      },
    });
  }

  async updatePaymentStatus(merchantOid: string, status: string, responseData?: any) {
    const payment = await prisma.payment.findUnique({
      where: { merchantOid },
    });

    if (!payment) {
      throw new Error('Ödeme kaydı bulunamadı');
    }

    await prisma.payment.update({
      where: { merchantOid },
      data: {
        status,
        paytrResponse: responseData,
      },
    });

    // Sipariş durumunu güncelle
    const paymentStatus = status === 'success' ? PaymentStatus.PAID : PaymentStatus.FAILED;
    const orderStatus = status === 'success' ? OrderStatus.CONFIRMED : OrderStatus.PENDING;

    await this.ordersService.updatePaymentStatus(payment.orderId, paymentStatus);
    await this.ordersService.updateStatus(payment.orderId, orderStatus);

    return payment;
  }

  async getPaymentByOrderId(orderId: string) {
    return prisma.payment.findUnique({
      where: { orderId },
    });
  }
}
