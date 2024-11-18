import sharp from 'sharp';
import { bucketName, randomImgName, s3 } from '../config/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export class FileStorageService {
  static async uploadPhoto(file: Express.Multer.File) {
    const buffer = await sharp(file.buffer)
      .resize({
        height: 300,
        width: 300,
        fit: 'cover'
      })
      .toBuffer();

    const randomName = randomImgName();
    const params = {
      Bucket: bucketName,
      Key: randomName,
      Body: buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return `${process.env.PHOTO_STORAGE}${randomName}`;
  }
}
