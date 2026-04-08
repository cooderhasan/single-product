import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User, UserRole } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
      include: { addresses: true },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    role?: UserRole;
    search?: string;
  }) {
    const { skip = 0, take = 20, role, search } = params;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          createdAt: true,
          _count: {
            select: { orders: true },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  }

  // Adres yönetimi
  async addAddress(userId: string, data: Omit<Prisma.AddressCreateInput, 'user'>) {
    return prisma.address.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async getAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async updateAddress(addressId: string, userId: string, data: Prisma.AddressUpdateInput) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Adres bulunamadı');
    }

    return prisma.address.update({
      where: { id: addressId },
      data,
    });
  }

  async deleteAddress(addressId: string, userId: string) {
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      throw new NotFoundException('Adres bulunamadı');
    }

    return prisma.address.delete({
      where: { id: addressId },
    });
  }

  async deleteUser(userId: string) {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Delete user (cascade will handle addresses, orders, etc.)
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
