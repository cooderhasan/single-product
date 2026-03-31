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
import { PostStatus, UserRole } from '@ecommerce/database';

import { BlogService } from './blog.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Blog yazıları' })
  async findAll(
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('category') categorySlug?: string,
  ) {
    return this.blogService.findAll({ skip, take, categorySlug });
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Blog kategorileri' })
  async getCategories() {
    return this.blogService.getCategories();
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Blog yazı detayı' })
  async findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  // Admin routes
  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Blog yazısı oluştur (Admin)' })
  async create(@Body() dto: CreateBlogPostDto) {
    return this.blogService.create({
      ...dto,
      status: dto.status as PostStatus,
    });
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Blog yazısı güncelle (Admin)' })
  async update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Blog yazısı sil (Admin)' })
  async delete(@Param('id') id: string) {
    return this.blogService.delete(id);
  }
}
