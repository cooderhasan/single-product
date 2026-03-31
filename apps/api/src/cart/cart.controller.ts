import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CartService } from './cart.service';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Sepet içeriği' })
  async getCart(
    @CurrentUser('sub') userId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.getCart(userId, sessionId);
  }

  @Public()
  @Post('items')
  @ApiOperation({ summary: 'Sepete ürün ekle' })
  async addItem(
    @Body() dto: AddToCartDto,
    @CurrentUser('sub') userId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.addItem(dto, userId, sessionId);
  }

  @Public()
  @Put('items/:id')
  @ApiOperation({ summary: 'Sepet öğesi güncelle' })
  async updateItem(
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.cartService.updateQuantity(itemId, dto.quantity, userId);
  }

  @Public()
  @Delete('items/:id')
  @ApiOperation({ summary: 'Sepetten ürün kaldır' })
  async removeItem(
    @Param('id') itemId: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.cartService.removeItem(itemId, userId);
  }

  @Public()
  @Delete()
  @ApiOperation({ summary: 'Sepeti temizle' })
  async clearCart(
    @CurrentUser('sub') userId?: string,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.cartService.clearCart(userId, sessionId);
  }

  @Post('merge')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Misafir sepetini kullanıcı sepetiyle birleştir' })
  async mergeCart(
    @CurrentUser('sub') userId: string,
    @Query('sessionId') sessionId: string,
  ) {
    return this.cartService.mergeCart(userId, sessionId);
  }
}
