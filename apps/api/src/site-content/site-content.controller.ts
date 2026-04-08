import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@ecommerce/database';

import { SiteContentService } from './site-content.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateSiteContentDto } from './dto/create-site-content.dto';
import { UpdateSiteContentDto } from './dto/update-site-content.dto';

@ApiTags('Site Content')
@Controller('site-content')
export class SiteContentController {
  constructor(private siteContentService: SiteContentService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Tüm site içeriklerini listele' })
  async findAll() {
    return this.siteContentService.findActive();
  }

  @Public()
  @Get(':key')
  @ApiOperation({ summary: 'Anahtara göre site içeriği getir' })
  async findByKey(@Param('key') key: string) {
    return this.siteContentService.findByKey(key);
  }

  // Admin routes
  @Get('admin/all')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm site içeriklerini listele (Admin)' })
  async findAllAdmin() {
    return this.siteContentService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Site içeriği oluştur (Admin)' })
  async create(@Body() dto: CreateSiteContentDto) {
    return this.siteContentService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Site içeriği güncelle (Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateSiteContentDto) {
    return this.siteContentService.update(id, dto);
  }

  @Put('by-key/:key')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Anahtara göre site içeriği güncelle (Admin)' })
  async updateByKey(@Param('key') key: string, @Body() dto: UpdateSiteContentDto) {
    return this.siteContentService.updateByKey(key, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Site içeriği sil (Admin)' })
  async delete(@Param('id') id: string) {
    return this.siteContentService.delete(id);
  }
}
