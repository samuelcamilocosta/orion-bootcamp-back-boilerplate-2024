import sharp from 'sharp';
import { ImageUploader } from '../third-party/ImageUploader';

export class FileStorageService {
  static async uploadPhoto(file: Express.Multer.File) {
    const buffer = await sharp(file.buffer)
      .resize({
        height: 300,
        width: 300,
        fit: 'cover'
      })
      .toBuffer();

    return ImageUploader.uploadPhotoS3(buffer, file.mimetype);
  }
}
