import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@ecommerce/database';

import { CreateSiteContentDto } from './dto/create-site-content.dto';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';

@Injectable()
export class SiteContentService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.siteContent.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findActive() {
    return this.prisma.siteContent.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByKey(key: string) {
    const content = await this.prisma.siteContent.findUnique({
      where: { key },
    });
    
    if (!content) {
      throw new NotFoundException(`Site content with key "${key}" not found`);
    }
    
    return content;
  }

  async findByKeyOrNull(key: string) {
    return this.prisma.siteContent.findUnique({
      where: { key },
    });
  }

  async create(dto: CreateSiteContentDto) {
    return this.prisma.siteContent.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateSiteContentDto) {
    await this.findOne(id); // Check existence
    
    return this.prisma.siteContent.update({
      where: { id },
      data: dto,
    });
  }

  async updateByKey(key: string, dto: UpdateSiteContentDto) {
    const content = await this.findByKeyOrNull(key);
    
    if (!content) {
      // Create if not exists
      return this.prisma.siteContent.create({
        data: { ...dto, key },
      });
    }
    
    return this.prisma.siteContent.update({
      where: { key },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Check existence
    
    return this.prisma.siteContent.delete({
      where: { id },
    });
  }

  private async findOne(id: string) {
    const content = await this.prisma.siteContent.findUnique({
      where: { id },
    });
    
    if (!content) {
      throw new NotFoundException(`Site content with ID "${id}" not found`);
    }
    
    return content;
  }
}
