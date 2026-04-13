import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  Req,
  Ip,
  RawBody,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { UserRole } from '@ecommerce/database';

import { PaytrService, PaytrPaymentData } from './paytr.service';
import { PaymentsService } from './payments.service';
import { OrdersService } from '../orders/orders.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreatePaytrPaymentDto } from './dto/create-paytr-payment.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private paytrService: PaytrService,
    private paymentsService: PaymentsService,
    private ordersService: OrdersService,
    private configService: ConfigService,
  ) {}

  @Post('paytr/initialize')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'PayTR ödeme başlat' })
  async initializePaytrPayment(
    @Body() dto: CreatePaytrPaymentDto,
    @Ip() ip: string,
  ) {
    const order = await this.ordersService.findByOrderNumber(dto.orderNumber);

    if (!order) {
      throw new Error('Sipariş bulunamadı');
    }

    // Sepet verisi oluştur
    const userBasket = order.items.map((item: any) => ({
      name: item.productName,
      price: Math.round(Number(item.price) * 100), // Kuruş cinsinden
      quantity: item.quantity,
    }));

    const siteUrl = this.configService.get('NEXT_PUBLIC_SITE_URL');

    // shippingAddress Json alanını parse et
    if (!order.shippingAddress) {
      throw new Error('Sipariş adresi bulunamadı');
    }
    const shippingAddress = order.shippingAddress as any;

    const paymentData: PaytrPaymentData = {
      userId: order.userId || undefined,
      userEmail: order.user?.email || order.guestEmail!,
      userName: shippingAddress.fullName || '',
      userAddress: `${shippingAddress.address || ''}, ${shippingAddress.district || ''}, ${shippingAddress.city || ''}`,
      userPhone: shippingAddress.phone || '',
      merchantOid: order.orderNumber,
      paymentAmount: Math.round(Number(order.total) * 100),
      currency: 'TL',
      userIp: ip,
      merchantOkUrl: `${siteUrl}/siparis/basarili?order=${order.orderNumber}`,
      merchantFailUrl: `${siteUrl}/siparis/basarisiz?order=${order.orderNumber}`,
      userBasket,
      testMode: this.configService.get('PAYTR_TEST_MODE') === '1' ? 1 : 0,
      noInstallment: 0,
      maxInstallment: 12,
    };

    const token = await this.paytrService.createPaymentForm(paymentData);

    // Ödeme kaydı oluştur
    await this.paymentsService.createPayment({
      orderId: order.id,
      merchantOid: order.orderNumber,
      paymentAmount: Number(order.total),
      status: 'pending',
    });

    return {
      token,
      iframeUrl: `https://www.paytr.com/odeme/guvenli/${token}`,
    };
  }

  @Post('paytr/callback')
  @Public()
  @ApiOperation({ summary: 'PayTR callback webhook' })
  async paytrCallback(
    @Body() callbackData: any,
    @Req() req: Request,
  ) {
    console.log('PayTR Callback:', callbackData);

    const isValid = this.paytrService.verifyCallback({
      merchant_oid: callbackData.merchant_oid,
      status: callbackData.status,
      total_amount: callbackData.total_amount,
      hash: callbackData.hash,
    });

    if (!isValid) {
      console.error('Invalid PayTR callback hash');
      return 'INVALID_HASH';
    }

    try {
      await this.paymentsService.updatePaymentStatus(
        callbackData.merchant_oid,
        callbackData.status,
        callbackData,
      );

      return 'OK';
    } catch (error) {
      console.error('PayTR callback error:', error);
      return 'ERROR';
    }
  }

  @Get(':orderId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sipariş ödeme bilgisi (Admin)' })
  async getPayment(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }
}
