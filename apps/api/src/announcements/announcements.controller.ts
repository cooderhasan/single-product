import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@ecommerce/database';

import { AnnouncementsService } from './announcements.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private announcementsService: AnnouncementsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Aktif duyuruları listele' })
  async findAll() {
    return this.announcementsService.findActive();
  }

  @Public()
  @Get('position/:position')
  @ApiOperation({ summary: 'Pozisyona göre duyurular' })
  async getByPosition(@Param('position') position: string) {
    return this.announcementsService.findByPosition(position);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Duyuru detayı' })
  async findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  // Admin routes
  @Get('admin/all')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm duyuruları listele (Admin)' })
  async findAllAdmin() {
    return this.announcementsService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duyuru oluştur (Admin)' })
  async create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duyuru güncelle (Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Duyuru sil (Admin)' })
  async delete(@Param('id') id: string) {
    return this.announcementsService.delete(id);
  }
}
