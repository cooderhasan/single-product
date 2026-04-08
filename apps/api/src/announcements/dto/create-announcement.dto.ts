import { IsString, IsOptional, IsInt, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnnouncementDto {
  @ApiProperty({ description: 'Duyuru mesajı' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'Link', required: false })
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({ description: 'Arka plan rengi (Tailwind class)', default: 'primary-700' })
  @IsOptional()
  @IsString()
  bgColor?: string;

  @ApiProperty({ description: 'Yazı rengi (Tailwind class)', default: 'white' })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiProperty({ description: 'Pozisyon: TOP_TICKER veya ANNOUNCEMENT_BAR', default: 'ANNOUNCEMENT_BAR' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ description: 'Başlangıç tarihi', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ description: 'Bitiş tarihi', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ description: 'Sıralama', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ description: 'Aktif mi', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
