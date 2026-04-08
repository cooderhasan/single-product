import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@ecommerce/database';

import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.announcement.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findActive() {
    const now = new Date();
    
    return this.prisma.announcement.findMany({
      where: {
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

  async findByPosition(position: string) {
    const now = new Date();
    
    return this.prisma.announcement.findMany({
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

  async findOne(id: string) {
    const announcement = await this.prisma.announcement.findUnique({
      where: { id },
    });
    
    if (!announcement) {
      throw new NotFoundException(`Announcement with ID "${id}" not found`);
    }
    
    return announcement;
  }

  async create(dto: CreateAnnouncementDto) {
    const data: any = { ...dto };
    
    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      data.endDate = new Date(dto.endDate);
    }
    
    return this.prisma.announcement.create({ data });
  }

  async update(id: string, dto: UpdateAnnouncementDto) {
    await this.findOne(id); // Check existence
    
    const data: any = { ...dto };
    
    if (dto.startDate) {
      data.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      data.endDate = new Date(dto.endDate);
    }
    
    return this.prisma.announcement.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Check existence
    
    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
