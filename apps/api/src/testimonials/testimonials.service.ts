import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@ecommerce/database';

import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@Injectable()
export class TestimonialsService {
  private prisma = new PrismaClient();

  async findAll() {
    return this.prisma.testimonial.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findActive() {
    return this.prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: string) {
    const testimonial = await this.prisma.testimonial.findUnique({
      where: { id },
    });
    
    if (!testimonial) {
      throw new NotFoundException(`Testimonial with ID "${id}" not found`);
    }
    
    return testimonial;
  }

  async create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    await this.findOne(id); // Check existence
    
    return this.prisma.testimonial.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Check existence
    
    return this.prisma.testimonial.delete({
      where: { id },
    });
  }
}
