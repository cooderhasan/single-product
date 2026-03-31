import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Product } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  inStock?: boolean;
  sortBy?: 'price' | 'name' | 'createdAt' | 'salesCount';
  sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class ProductsService {
  async findAll(params: {
    skip?: number;
    take?: number;
    filters?: ProductFilters;
  }) {
    const { skip = 0, take = 20, filters = {} } = params;

    const where: Prisma.ProductWhereInput = { isActive: true };

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    if (filters.inStock) {
      where.stock = { gt: 0 };
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (filters.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          variants: {
            where: { isActive: true },
          },
          _count: {
            select: { reviews: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
          include: {
            options: {
              include: { attribute: true },
            },
          },
        },
        attributes: true,
        reviews: {
          where: { isApproved: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { firstName: true, lastName: true },
            },
          },
        },
        _count: {
          select: { reviews: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Ürün bulunamadı');
    }

    // Görüntülenme sayısını artır
    await prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: { include: { options: true } },
        attributes: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Ürün bulunamadı');
    }

    return product;
  }

  async create(data: { categoryId: string; images?: string[]; variants?: any[] } & Omit<Prisma.ProductCreateInput, 'category'>) {
    const { images, variants, categoryId, ...productData } = data;

    return prisma.product.create({
      data: {
        ...productData,
        category: { connect: { id: categoryId } },
        images: images ? {
          create: images.map((url, index) => ({
            url,
            sortOrder: index,
            isMain: index === 0,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput & { images?: string[] }) {
    const { images, ...productData } = data;

    // Önce mevcut görselleri temizle
    if (images) {
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });
    }

    return prisma.product.update({
      where: { id },
      data: {
        ...productData,
        images: images ? {
          create: images.map((url, index) => ({
            url,
            sortOrder: index,
            isMain: index === 0,
          })),
        } : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async getFeatured() {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      include: {
        category: { select: { name: true, slug: true } },
        images: { take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRelated(productId: string, categoryId: string) {
    return prisma.product.findMany({
      where: {
        isActive: true,
        categoryId,
        id: { not: productId },
      },
      take: 4,
      include: {
        category: { select: { name: true, slug: true } },
        images: { take: 1 },
      },
    });
  }
}
