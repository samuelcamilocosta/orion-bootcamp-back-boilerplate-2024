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
import { LessonRequestController } from './controller/LessonRequestController';
import { SubjectController } from './controller/SubjectController';
import { upload } from './config/s3Client';
import { UpdatePersonalDataValidator } from './validator/UpdatePersonalDataValidator';
import { UploadPhotoValidator } from './validator/UploadPhotoValidator';
import { LessonRequestValidator } from './validator/LessonRequestValidator';

const router = Router();

// Home route
router.get('/', new HomeController().hello);

// Tutor routes
router.post(
  '/api/register/tutor',
  TutorValidator.createTutor(),
  new TutorController().create
);

router.get('/api/get/tutor', authMiddleware(), new TutorController().getAll);

router.patch(
  '/api/update/tutor',
  UpdatePersonalDataValidator,
  new TutorController().updatePersonalData
);

router.patch(
  '/api/update/photo',
  upload.single('image'),
  UploadPhotoValidator,
  new TutorController().updatePhoto
);

router.get(
  '/api/get/tutor/:id',
  authMiddleware(),
  new TutorController().getById
);

// Students routes
router.get(
  '/api/get/student',
  authMiddleware(),
  new StudentController().getAll
);

router.post(
  '/api/register/student',
  StudentValidator.createStudent(),
  new StudentController().create
);

router.get('/api/get/student/:id', new StudentController().getById);

// Education Level routes
router.post(
  '/api/register/educationlevel',
  authMiddleware(),
  new EducationLevelController().create
);

router.get('/api/get/educationlevel', new EducationLevelController().getAll);

// Login route
router.post('/api/login', AuthValidator.login(), new AuthController().login);

// Lesson Request route
router.post(
  '/api/register/lessonrequest',
  cors(),
  authMiddleware(),
  LessonRequestValidator.createLessonRequest(),
  new LessonRequestController().create
);

router.get(
  '/api/get/lessonrequest',
  cors(),
  authMiddleware(),
  new LessonRequestController().getAll
);

router.get('/api/get/lessonrequest/:id', new LessonRequestController().getById);

// Subject route
router.post(
  '/api/register/subject',
  cors(),
  authMiddleware(),
  new SubjectController().create
);
router.get(
  '/api/get/subject',
  cors(),
  authMiddleware(),
  new SubjectController().getAll
);
export default router;
