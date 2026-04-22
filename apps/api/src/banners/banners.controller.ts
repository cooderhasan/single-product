import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BannerPosition, UserRole } from '@ecommerce/database';

import { BannersService } from './banners.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@ApiTags('Banners')
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Banner listesi' })
  async findAll(@Query('position') position?: BannerPosition) {
    return this.bannersService.findAll(position);
  }

  @Public()
  @Get('position/:position')
  @ApiOperation({ summary: 'Pozisyona göre bannerlar' })
  async getByPosition(@Param('position') position: BannerPosition) {
    return this.bannersService.getByPosition(position);
  }

  // Admin routes
  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Banner oluştur (Admin)' })
  async create(@Body() dto: CreateBannerDto) {
    return this.bannersService.create({
      ...dto,
      position: dto.position as BannerPosition,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Banner güncelle (Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.bannersService.update(id, {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Banner sil (Admin)' })
  async delete(@Param('id') id: string) {
    return this.bannersService.delete(id);
  }
}
