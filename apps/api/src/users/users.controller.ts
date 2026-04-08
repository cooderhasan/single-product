import {
  Controller,
  Get,
  Put,
  Body,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
  Post,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@ecommerce/database';

import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateAddressDto } from './dto/create-address.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı profili' })
  async getProfile(@CurrentUser('sub') userId: string) {
    return this.usersService.findById(userId);
  }

  @Put('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil güncelle' })
  async updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.update(userId, dto);
  }

  // Admin routes
  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm kullanıcılar (Admin)' })
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('role') role?: UserRole,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({ skip, take, role, search });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı güncelle (Admin)' })
  async updateUser(
    @Param('id') userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kullanıcı sil (Admin)' })
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }

  // Address routes
  @Get('addresses')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adres listesi' })
  async getAddresses(@CurrentUser('sub') userId: string) {
    return this.usersService.getAddresses(userId);
  }

  @Post('addresses')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Yeni adres ekle' })
  async addAddress(
    @CurrentUser('sub') userId: string,
    @Body() dto: CreateAddressDto,
  ) {
    return this.usersService.addAddress(userId, dto);
  }

  @Put('addresses/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adres güncelle' })
  async updateAddress(
    @CurrentUser('sub') userId: string,
    @Param('id') addressId: string,
    @Body() dto: Partial<CreateAddressDto>,
  ) {
    return this.usersService.updateAddress(addressId, userId, dto);
  }

  @Delete('addresses/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adres sil' })
  async deleteAddress(
    @CurrentUser('sub') userId: string,
    @Param('id') addressId: string,
  ) {
    return this.usersService.deleteAddress(addressId, userId);
  }
}
