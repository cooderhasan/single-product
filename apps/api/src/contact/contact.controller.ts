import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { Request } from 'express';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@ecommerce/database';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Send contact message' })
  create(@Body() createContactMessageDto: CreateContactMessageDto, @Req() req: Request) {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    return this.contactService.create(createContactMessageDto, ipAddress, userAgent);
  }

  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all contact messages (Admin)' })
  findAll() {
    return this.contactService.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a contact message by id (Admin)' })
  findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Put(':id/status')
  @ApiOperation({ summary: 'Update contact message status (Admin)' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.contactService.updateStatus(id, status);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact message (Admin)' })
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
