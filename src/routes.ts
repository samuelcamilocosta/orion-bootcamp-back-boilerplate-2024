import { Request, Response, Router } from 'express';
import { HomeController } from './controller/HomeController';
import { TutorController } from './controller/TutorController';
import { TutorValidator } from './validator/TutorValidator';
import { StudentValidator } from './validator/StudentValidator';
import { StudentController } from './controller/StudentController';
import { EducationLevelController } from './controller/EducationLevelController';
import { LessonRequestController } from './controller/LessonRequestController';
import { SubjectController } from './controller/SubjectController';
import { MysqlDataSource } from './config/database';
import { Tutor } from './entity/Tutor';
import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import crypto from 'crypto';
import sharp from 'sharp';

dotenv.config();

const randomImgName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const bucketRegion = process.env.BUCKET_REGION;
const bucketName = process.env.BUCKET_NAME;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey
  },
  region: bucketRegion
});

const router = Router();

// Home route
router.get('/', new HomeController().hello);

// Tutor routes
router.post(
  '/api/register/tutor',
  TutorValidator.createTutor(),
  new TutorController().create
);

router.get('/api/get/tutor', new TutorController().getAll);

router.patch('/api/update/tutor', new TutorController().updatePersonalData);
// router.patch('/api/update/tutorPhoto', new TutorController().updatePhoto);

// Students routes
router.get('/api/get/student', new StudentController().getAll);

router.post(
  '/api/register/student',
  StudentValidator.createStudent(),
  new StudentController().create
);

// Education Level routes
router.post(
  '/api/register/educationlevel',
  new EducationLevelController().create
);

router.get('/api/get/educationlevel', new EducationLevelController().getAll);

// Lesson Request route
router.post(
  '/api/register/lessonrequest',
  new LessonRequestController().create
);

router.get('/api/get/lessonrequest', new LessonRequestController().getAll);

// Subject route
router.post('/api/register/subject', new SubjectController().create);
router.get('/api/get/subject', new SubjectController().getAll);

// AWS routes

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post(
  '/api/update/photo',
  upload.single('image'),
  // Funcionando!
  async (req: Request, res: Response) => {
    const buffer = await sharp(req.file.buffer)
      .resize({
        height: 300,
        width: 300,
        fit: 'cover'
      })
      .toBuffer();
    console.log('req.body: ', req.body);
    console.log('req.file:', req.file);

    const params = {
      Bucket: bucketName,
      Key: randomImgName(),
      Body: buffer,
      ContentType: req.file.mimetype
    };

    const command = new PutObjectCommand(params);
    // Envia para o s3
    await s3.send(command);

    res.send({});
  }
);

router.get('/api/photo', async (req: Request, res: Response) => {
  const photos = await MysqlDataSource.getRepository(Tutor).find({
    select: ['photoUrl']
  });
  res.send(photos);
});

export default router;
