import { IsString, IsOptional, IsInt, IsBoolean, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteContentDto {
  @ApiProperty({ description: 'Benzersiz anahtar' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'Başlık' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Alt başlık', required: false })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiProperty({ description: 'Açıklama', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Görsel URL', required: false })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Buton metni', required: false })
  @IsOptional()
  @IsString()
  buttonText?: string;

  @ApiProperty({ description: 'Buton linki', required: false })
  @IsOptional()
  @IsString()
  buttonLink?: string;

  @ApiProperty({ description: 'Ek veriler (JSON)', required: false })
  @IsOptional()
  data?: any;

  @ApiProperty({ description: 'Sıralama', default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ description: 'Aktif mi', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
