import { Injectable, BadRequestException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    // Uploads klasörünü oluştur
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    const folders = ['products', 'banners', 'categories', 'testimonials'];
    for (const folder of folders) {
      const dir = join(this.uploadDir, folder);
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        console.error(`Klasör oluşturma hatası: ${dir}`, error);
      }
    }
  }

  async uploadImage(file: Express.Multer.File, folder: string = 'products'): Promise<string> {
    if (!file) {
      throw new BadRequestException('Dosya bulunamadı');
    }

    // Dosya tipi kontrolü
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Sadece JPEG, PNG ve WebP formatları desteklenir');
    }

    // Dosya boyutu kontrolü (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Dosya boyutu 5MB\'ı geçemez');
    }

    try {
      // Benzersiz dosya adı oluştur
      const extension = file.originalname.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;
      const dirPath = join(this.uploadDir, folder);
      const filePath = join(dirPath, filename);

      // Klasörün var olduğundan emin ol
      await fs.mkdir(dirPath, { recursive: true });

      // Dosyayı kaydet
      await fs.writeFile(filePath, file.buffer);

      // Public URL döndür
      return `/uploads/${folder}/${filename}`;
    } catch (error) {
      throw new BadRequestException('Dosya kaydedilirken hata oluştu: ' + error.message);
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder: string = 'products'): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Dosya bulunamadı');
    }

    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(url: string): Promise<void> {
    try {
      // URL'den dosya yolunu çıkar: /uploads/products/xxx.jpg
      const relativePath = url.replace('/uploads/', '');
      const filePath = join(this.uploadDir, relativePath);
      
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Dosya silme hatası:', error);
    }
  }
}
