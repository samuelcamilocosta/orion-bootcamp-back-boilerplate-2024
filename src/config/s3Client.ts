import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import crypto from 'crypto';
import multer from 'multer';

dotenv.config();

export const randomImgName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString('hex');

export const bucketRegion = process.env.BUCKET_REGION;
export const bucketName = process.env.BUCKET_NAME;
export const accessKey = process.env.ACCESS_KEY;
export const secretAccessKey = process.env.SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
});

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage
});
