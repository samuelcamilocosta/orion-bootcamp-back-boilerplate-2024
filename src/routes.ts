import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { TutorController } from './controller/TutorController';
import { TutorValidator } from './validator/TutorValidator';
import { StudentValidator } from './validator/StudentValidator';
import { AuthValidator } from './validator/AuthValidator';
import { StudentController } from './controller/StudentController';
import { EducationLevelController } from './controller/EducationLevelController';
import { AuthController } from './controller/AuthController';
import { authMiddleware } from './middleware/AuthMiddleware';
import cors from 'cors';
import { LessonRequestController } from './controller/LessonRequestController';
import { SubjectController } from './controller/SubjectController';
import { upload } from './config/s3Client';
import { UpdatePersonalDataValidator } from './validator/UpdatePersonalDataValidator';
import { UploadPhotoValidator } from './validator/UploadPhotoValidator';

const router = Router();

// Home route
router.get('/', new HomeController().hello);

// Tutor routes
router.post(
  '/api/register/tutor',
  cors(),
  TutorValidator.createTutor(),
  new TutorController().create
);

router.get(
  '/api/get/tutor',
  cors(),
  authMiddleware(),
  new TutorController().getAll
);

router.patch(
  '/api/update/tutor',
  UpdatePersonalDataValidator,
  new TutorController().updatePersonalData
);

router.post(
  '/api/update/photo',
  upload.single('image'),
  UploadPhotoValidator,
  new TutorController().updatePhoto
);

router.get(
  '/api/get/tutor/:id',
  cors(),
  authMiddleware(),
  new TutorController().getById
);

// Students routes
router.get(
  '/api/get/student',
  cors(),
  authMiddleware(),
  new StudentController().getAll
);

router.post(
  '/api/register/student',
  cors(),
  StudentValidator.createStudent(),
  new StudentController().create
);

router.get('/api/get/student/:id', new StudentController().getById);

// Education Level routes
router.post(
  '/api/register/educationlevel',
  cors(),
  authMiddleware(),
  new EducationLevelController().create
);

router.get(
  '/api/get/educationlevel',
  cors(),
  new EducationLevelController().getAll
);

// Login route
router.post(
  '/api/login',
  cors(),
  AuthValidator.login(),
  new AuthController().login
);

// Lesson Request route
router.post(
  '/api/register/lessonrequest',
  new LessonRequestController().create
);

router.get('/api/get/lessonrequest', new LessonRequestController().getAll);

router.get('/api/get/lessonrequest/:id', new LessonRequestController().getById);

// Subject route
router.post('/api/register/subject', new SubjectController().create);
router.get('/api/get/subject', new SubjectController().getAll);

export default router;
