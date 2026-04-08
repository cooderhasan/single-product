import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@ecommerce/database';

import { TestimonialsService } from './testimonials.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateTestimonialDto } from './dto/create-testimonial.dto';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';

@ApiTags('Testimonials')
@Controller('testimonials')
export class TestimonialsController {
  constructor(private testimonialsService: TestimonialsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Aktif müşteri yorumlarını listele' })
  async findAll() {
    return this.testimonialsService.findActive();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Müşteri yorumu detayı' })
  async findOne(@Param('id') id: string) {
    return this.testimonialsService.findOne(id);
  }

  // Admin routes
  @Get('admin/all')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tüm müşteri yorumlarını listele (Admin)' })
  async findAllAdmin() {
    return this.testimonialsService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Müşteri yorumu oluştur (Admin)' })
  async create(@Body() dto: CreateTestimonialDto) {
    return this.testimonialsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Müşteri yorumu güncelle (Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateTestimonialDto) {
    return this.testimonialsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Müşteri yorumu sil (Admin)' })
  async delete(@Param('id') id: string) {
    return this.testimonialsService.delete(id);
  }
}
