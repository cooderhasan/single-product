import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@ecommerce/database';

export interface CartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

@Injectable()
export class CartService {
  async getCart(userId?: string, sessionId?: string) {
    // En az birinin olması gerekli
    if (!userId && !sessionId) {
      return {
        items: [],
        total: 0,
        count: 0,
      };
    }

    const where = userId ? { userId } : { sessionId };

    const cartItems = await prisma.cartItem.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            stock: true,
            images: { take: 1 },
          },
        },
      },
    });

    // Toplam tutarı hesapla
    const total = cartItems.reduce((sum, item) => {
      return sum + Number(item.product.price) * item.quantity;
    }, 0);

    return {
      items: cartItems,
      total,
      count: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  async addItem(data: CartItemInput, userId?: string, sessionId?: string) {
    // Session ID veya User ID kontrolü
    if (!userId && !sessionId) {
      throw new NotFoundException('Oturum bilgisi bulunamadı');
    }

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new NotFoundException('Ürün bulunamadı');
    }

    if (product.stock < data.quantity) {
      throw new NotFoundException('Yetersiz stok');
    }

    // Mevcut ürünü güncelle veya yeni ekle
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        productId: data.productId,
        variantId: data.variantId || null,
        ...(userId ? { userId } : { sessionId }),
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + data.quantity;
      if (product.stock < newQuantity) {
        throw new NotFoundException('Yetersiz stok');
      }
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    }

    return prisma.cartItem.create({
      data: {
        productId: data.productId,
        variantId: data.variantId || null,
        quantity: data.quantity,
        ...(userId ? { userId } : { sessionId }),
      },
      include: { product: true },
    });
  }

  async updateQuantity(itemId: string, quantity: number, userId?: string) {
    const where = userId ? { id: itemId, userId } : { id: itemId };

    const item = await prisma.cartItem.findFirst({
      where,
      include: { product: true },
    });

    if (!item) {
      throw new NotFoundException('Sepet öğesi bulunamadı');
    }

    if (quantity <= 0) {
      return this.removeItem(itemId, userId);
    }

    if (item.product.stock < quantity) {
      throw new NotFoundException('Yetersiz stok');
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });
  }

  async removeItem(itemId: string, userId?: string) {
    const where = userId ? { id: itemId, userId } : { id: itemId };

    const item = await prisma.cartItem.findFirst({
      where,
    });

    if (!item) {
      throw new NotFoundException('Sepet öğesi bulunamadı');
    }

    return prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(userId?: string, sessionId?: string) {
    const where = userId ? { userId } : { sessionId };

    return prisma.cartItem.deleteMany({
      where,
    });
  }

  async mergeCart(userId: string, sessionId: string) {
    const sessionItems = await prisma.cartItem.findMany({
      where: { sessionId },
    });

    for (const item of sessionItems) {
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId: item.productId,
          variantId: item.variantId,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + item.quantity },
        });
        await prisma.cartItem.delete({ where: { id: item.id } });
      } else {
        await prisma.cartItem.update({
          where: { id: item.id },
          data: { userId, sessionId: null },
        });
      }
    }

    return this.getCart(userId);
  }
}
