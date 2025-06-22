import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: undefined, // Memory storage kullan
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        // Sadece resim dosyalarını kabul et
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Sadece resim dosyaları kabul edilir.'), false);
        }
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Resim dosyası gerekli');
    }

    try {
      const imageUrl = await this.uploadService.uploadAndOptimizeImage(file);
      return {
        success: true,
        imageUrl,
        message: 'Resim başarıyla yüklendi',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
} 