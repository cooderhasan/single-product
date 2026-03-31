import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, BannerPosition } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';

@Injectable()
export class BannersService {
  async findAll(position?: BannerPosition) {
    const where: Prisma.BannerWhereInput = { isActive: true };
    
    if (position) {
      where.position = position;
    }

    return prisma.banner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findById(id: string) {
    const banner = await prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException('Banner bulunamadı');
    }

    return banner;
  }

  async getByPosition(position: BannerPosition) {
    const now = new Date();
    
    return prisma.banner.findMany({
      where: {
        position,
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: Prisma.BannerCreateInput) {
    return prisma.banner.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BannerUpdateInput) {
    return prisma.banner.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.banner.delete({
      where: { id },
    });
  }
}
