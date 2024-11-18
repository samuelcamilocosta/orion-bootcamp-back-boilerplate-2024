import sharp from 'sharp';
import { S3Uploader } from '../third-party/S3Uploader';

export class FileStorageService {
  static async uploadPhoto(file: Express.Multer.File) {
    const buffer = await sharp(file.buffer)
      .resize({
        height: 300,
        width: 300,
        fit: 'cover'
      })
      .toBuffer();

    return await S3Uploader.uploadPhotoS3(buffer, file.mimetype);
  }
}
