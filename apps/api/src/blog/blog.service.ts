import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PostStatus } from '@ecommerce/database';
import { prisma } from '@ecommerce/database';

@Injectable()
export class BlogService {
  async findAll(params: {
    skip?: number;
    take?: number;
    categorySlug?: string;
    status?: PostStatus;
  }) {
    const { skip = 0, take = 10, categorySlug, status = PostStatus.PUBLISHED } = params;

    const where: Prisma.BlogPostWhereInput = { status };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return { posts, total };
  }

  async findBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Yazı bulunamadı');
    }

    // Görüntülenme sayısını artır
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    });

    return post;
  }

  async getCategories() {
    return prisma.blogCategory.findMany({
      include: {
        _count: { select: { posts: true } },
      },
    });
  }

  async create(data: Prisma.BlogPostCreateInput) {
    return prisma.blogPost.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BlogPostUpdateInput) {
    return prisma.blogPost.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.blogPost.delete({
      where: { id },
    });
  }
}
