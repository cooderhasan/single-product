import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';

@Injectable()
export class CategoriesService {
  async findAll() {
    return prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        parent: true,
        children: {
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        parent: true,
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    return category;
  }

  async findById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Kategori bulunamadı');
    }

    return category;
  }

  async create(data: Prisma.CategoryCreateInput) {
    return prisma.category.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }
}
