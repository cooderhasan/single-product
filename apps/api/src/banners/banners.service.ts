import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, BannerPosition } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';

@Injectable()
export class BannersService {
  async findAll(position?: BannerPosition) {
    const where: Prisma.BannerWhereInput = { isActive: true };
    
    if (position) {
      where.position = position.toString().toUpperCase() as BannerPosition;
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
    const normalizedPosition = position.toString().toUpperCase() as BannerPosition;

    return prisma.banner.findMany({
      where: {
        position: normalizedPosition,
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
    const createData: any = { ...data };
    if (data.startDate) {
      createData.startDate = new Date(data.startDate as any);
    }
    if (data.endDate) {
      createData.endDate = new Date(data.endDate as any);
    }
    return prisma.banner.create({
      data: createData,
    });
  }

  async update(id: string, data: Prisma.BannerUpdateInput) {
    const updateData: any = { ...data };
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate as any);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate as any);
    }
    return prisma.banner.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return prisma.banner.delete({
      where: { id },
    });
  }
}
