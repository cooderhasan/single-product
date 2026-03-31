import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@ecommerce/database';

import { ProductsService } from './products.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFiltersDto } from './dto/product-filters.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Ürün listesi' })
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query() filters?: ProductFiltersDto,
  ) {
    return this.productsService.findAll({
      skip,
      take,
      filters: {
        categoryId: filters?.categoryId,
        minPrice: filters?.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters?.maxPrice ? Number(filters.maxPrice) : undefined,
        search: filters?.search,
        isFeatured: filters?.isFeatured,
        inStock: filters?.inStock,
        sortBy: filters?.sortBy,
        sortOrder: filters?.sortOrder,
      },
    });
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Öne çıkan ürünler' })
  async getFeatured() {
    return this.productsService.getFeatured();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Ürün detayı (slug)' })
  async findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'İlgili ürünler' })
  async getRelated(@Param('id') id: string, @Query('categoryId') categoryId: string) {
    return this.productsService.getRelated(id, categoryId);
  }

  // Admin routes
  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ürün oluştur (Admin)' })
  async create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ürün güncelle (Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ürün sil (Admin)' })
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
