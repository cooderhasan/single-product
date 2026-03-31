import { Injectable } from '@nestjs/common';
import { Prisma, CouponType } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';

@Injectable()
export class CouponsService {
  async findAll(params: { skip?: number; take?: number; isActive?: boolean }) {
    const { skip = 0, take = 20, isActive } = params;

    const where: Prisma.CouponWhereInput = {};
    if (isActive !== undefined) where.isActive = isActive;

    const [coupons, total] = await Promise.all([
      prisma.coupon.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.coupon.count({ where }),
    ]);

    return { coupons, total };
  }

  async findByCode(code: string) {
    return prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  async validateCoupon(code: string, orderAmount: number) {
    const coupon = await this.findByCode(code);

    if (!coupon) {
      return { valid: false, message: 'Kupon kodu geçersiz' };
    }

    if (!coupon.isActive) {
      return { valid: false, message: 'Bu kupon kodu aktif değil' };
    }

    const now = new Date();
    if (coupon.startDate > now) {
      return { valid: false, message: 'Bu kupon henüz aktif değil' };
    }

    if (coupon.endDate && coupon.endDate < now) {
      return { valid: false, message: 'Bu kupon kodunun süresi dolmuş' };
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return { valid: false, message: 'Bu kupon kodunun kullanım limiti dolmuş' };
    }

    if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
      return { 
        valid: false, 
        message: `Bu kupon için minimum sipariş tutarı ${coupon.minOrderAmount} TL` 
      };
    }

    let discount = 0;
    if (coupon.type === CouponType.PERCENTAGE) {
      discount = orderAmount * (Number(coupon.value) / 100);
      if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
        discount = Number(coupon.maxDiscount);
      }
    } else if (coupon.type === CouponType.FIXED_AMOUNT) {
      discount = Number(coupon.value);
    } else if (coupon.type === CouponType.FREE_SHIPPING) {
      discount = 0; // Kargo ücretsiz
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        discount,
      },
    };
  }

  async create(data: Prisma.CouponCreateInput) {
    return prisma.coupon.create({
      data: {
        ...data,
        code: data.code.toUpperCase(),
      },
    });
  }

  async update(id: string, data: Prisma.CouponUpdateInput) {
    return prisma.coupon.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.coupon.delete({
      where: { id },
    });
  }
}
