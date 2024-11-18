import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3, bucketName, randomImgName } from '../config/s3Client';

export class S3Uploader {
  static async uploadPhotoS3(
    buffer: Buffer,
    mimeType: string
  ): Promise<string> {
    const randomName = randomImgName();
    const params = {
      Bucket: bucketName,
      Key: randomName,
      Body: buffer,
      ContentType: mimeType
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    return `${process.env.PHOTO_STORAGE}${randomName}`;
  }
}
