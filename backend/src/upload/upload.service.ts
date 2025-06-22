import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadService {
  private readonly uploadPath = 'uploads/images';

  constructor() {
    // Uploads klasörünü oluştur
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadAndOptimizeImage(file: Express.Multer.File): Promise<string> {
    try {
      // Benzersiz dosya adı oluştur
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.originalname);
      const filename = `${timestamp}-${randomString}${extension}`;
      const filepath = path.join(this.uploadPath, filename);

      // Resmi 800x600 72dpi olarak optimize et
      await sharp(file.buffer)
        .resize(800, 600, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({
          quality: 85,
          progressive: true,
        })
        .png({
          quality: 85,
          progressive: true,
        })
        .toFile(filepath);

      // Dosya URL'ini döndür
      return `/uploads/images/${filename}`;
    } catch (error) {
      throw new Error(`Resim yükleme hatası: ${error.message}`);
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
        return;
      }

      const filepath = path.join(process.cwd(), imageUrl.substring(1));
      
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (error) {
      console.error('Resim silme hatası:', error);
    }
  }
} 