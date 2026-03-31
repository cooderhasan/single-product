import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export interface PaytrPaymentData {
  userId?: string;
  userEmail: string;
  userName: string;
  userAddress: string;
  userPhone: string;
  merchantOid: string;
  paymentAmount: number; // Kuruş cinsinden
  currency?: string;
  userIp: string;
  merchantOkUrl: string;
  merchantFailUrl: string;
  userBasket: Array<{
    name: string;
    price: number; // Kuruş cinsinden
    quantity: number;
  }>;
  debugOn?: number;
  testMode?: number;
  noInstallment?: number;
  maxInstallment?: number;
}

export interface PaytrCallbackData {
  merchant_oid: string;
  status: string;
  total_amount: string;
  hash: string;
}

@Injectable()
export class PaytrService {
  private readonly merchantId: string;
  private readonly merchantKey: string;
  private readonly merchantSalt: string;
  private readonly testMode: boolean;

  constructor(private configService: ConfigService) {
    this.merchantId = this.configService.get('PAYTR_MERCHANT_ID') || '';
    this.merchantKey = this.configService.get('PAYTR_MERCHANT_KEY') || '';
    this.merchantSalt = this.configService.get('PAYTR_MERCHANT_SALT') || '';
    this.testMode = this.configService.get('PAYTR_TEST_MODE') === '1';
  }

  async createPaymentForm(data: PaytrPaymentData): Promise<string> {
    // Sepet verisini JSON ve base64 encode yap
    const userBasket = Buffer.from(JSON.stringify(data.userBasket)).toString('base64');

    // Hash oluştur
    const hashStr = `${this.merchantId}${data.userIp}${data.merchantOid}${data.userEmail}${data.paymentAmount}${userBasket}${data.noInstallment || 0}${data.maxInstallment || 0}${data.currency || 'TL'}${this.testMode ? 1 : 0}${data.debugOn || 0}`;
    
    const paytrToken = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr + this.merchantSalt)
      .digest('base64');

    // PayTR API'ye istek gönder
    const formData = new URLSearchParams();
    formData.append('merchant_id', this.merchantId);
    formData.append('user_ip', data.userIp);
    formData.append('merchant_oid', data.merchantOid);
    formData.append('email', data.userEmail);
    formData.append('payment_amount', data.paymentAmount.toString());
    formData.append('paytr_token', paytrToken);
    formData.append('user_basket', userBasket);
    formData.append('debug_on', (data.debugOn || 0).toString());
    formData.append('test_mode', this.testMode ? '1' : '0');
    formData.append('no_installment', (data.noInstallment || 0).toString());
    formData.append('max_installment', (data.maxInstallment || 12).toString());
    formData.append('user_name', data.userName);
    formData.append('user_address', data.userAddress);
    formData.append('user_phone', data.userPhone);
    formData.append('merchant_ok_url', data.merchantOkUrl);
    formData.append('merchant_fail_url', data.merchantFailUrl);
    formData.append('timeout_limit', '30');
    formData.append('currency', data.currency || 'TL');

    try {
      const response = await fetch('https://www.paytr.com/odeme/api/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.status === 'success') {
        return result.token;
      } else {
        throw new BadRequestException(`PayTR Error: ${result.err_msg}`);
      }
    } catch (error) {
      throw new BadRequestException('Ödeme tokeni alınamadı');
    }
  }

  verifyCallback(data: PaytrCallbackData): boolean {
    const { merchant_oid, status, total_amount, hash } = data;

    const hashStr = `${merchant_oid}${this.merchantSalt}${status}${total_amount}`;
    const token = crypto
      .createHmac('sha256', this.merchantKey)
      .update(hashStr)
      .digest('base64');

    return token === hash;
  }

  generateIframeToken(token: string): string {
    return `<script src="https://www.paytr.com/js/iframeResizer.min.js"></script>
    <iframe src="https://www.paytr.com/odeme/guvenli/${token}" id="paytriframe" frameborder="0" scrolling="no" style="width: 100%;"></iframe>
    <script>iFrameResize({}, '#paytriframe');</script>`;
  }
}
