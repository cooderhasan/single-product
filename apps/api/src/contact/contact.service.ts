import { Injectable } from '@nestjs/common';
import { prisma } from '@ecommerce/database';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactService {
  async create(data: CreateContactMessageDto, ipAddress?: string, userAgent?: string) {
    return prisma.contactMessage.create({
      data: {
        ...data,
        ipAddress,
        userAgent,
      },
    });
  }

  async findAll() {
    return prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return prisma.contactMessage.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string) {
    return prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    return prisma.contactMessage.delete({
      where: { id },
    });
  }
}
