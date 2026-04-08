import { IsString, IsOptional, IsInt, IsBoolean, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestimonialDto {
  @ApiProperty({ description: 'Müşteri adı' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Lokasyon', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ description: 'Yorum başlığı' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Yorum içeriği' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'Puan (1-5)', default: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ description: 'Müşteri görseli', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Sıralama', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ description: 'Aktif mi', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
