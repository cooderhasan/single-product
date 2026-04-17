import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderStatus, UserRole } from '@ecommerce/database';

import { OrdersService } from './orders.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  // Admin routes - Önce tanımlanmalı (route sıralaması önemli)
  @Get('dashboard/stats')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dashboard istatistikleri' })
  async getDashboardStats() {
    return this.ordersService.getDashboardStats();
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm siparişler (Admin)' })
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: OrderStatus,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    const takeNum = take ? parseInt(take, 10) : undefined;
    return this.ordersService.findAll({ skip: skipNum, take: takeNum, status });
  }

  @Get('my-orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcının siparişleri' })
  async getMyOrders(
    @CurrentUser('sub') userId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const skipNum = skip ? parseInt(skip, 10) : undefined;
    const takeNum = take ? parseInt(take, 10) : undefined;
    return this.ordersService.findAll({ skip: skipNum, take: takeNum, userId });
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sipariş detayı' })
  async findById(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @CurrentUser('role') role: UserRole,
  ) {
    // Admin tüm siparişleri görebilir
    const checkUserId = role === UserRole.ADMIN ? undefined : userId;
    return this.ordersService.findById(id, checkUserId);
  }

  @Public()
  @Post()
  @ApiOperation({ summary: 'Yeni sipariş oluştur' })
  async create(
    @Body() dto: CreateOrderDto,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.ordersService.create({
      ...dto,
      userId,
    });
  }

  @Put(':id/status')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sipariş durumu güncelle' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status, dto.adminNote);
  }
}
