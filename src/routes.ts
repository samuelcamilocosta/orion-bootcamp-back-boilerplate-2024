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
  '/api/tutor',
  TutorValidator.createTutor(),
  new TutorController().create
);

router.get('/api/tutor', authMiddleware(), new TutorController().getAll);
router.get('/api/tutor/:id', authMiddleware(), new TutorController().getById);

router.patch(
  '/api/tutor',
  authMiddleware(),
  UpdatePersonalDataValidator,
  new TutorController().updatePersonalData
);

router.patch(
  '/api/photo',
  authMiddleware(),
  upload.single('image'),
  UploadPhotoValidator,
  new TutorController().updatePhoto
);

router.patch(
  '/api/tutor-accept-lesson',
  authMiddleware(),
  new TutorController().acceptLessonRequest
);

// Students routes
router.get('/api/student', authMiddleware(), new StudentController().getAll);

router.post(
  '/api/student',
  StudentValidator.createStudent(),
  new StudentController().create
);

router.get(
  '/api/student/:id',
  authMiddleware(),
  new StudentController().getById
);

router.get(
  '/api/student-lesson-status',
  authMiddleware(),
  new StudentController().getStudentLessons
);

// Education Level routes
router.post(
  '/api/educationlevel',
  authMiddleware(),
  new EducationLevelController().create
);

router.get(
  '/api/educationlevel',
  authMiddleware(),
  new EducationLevelController().getAll
);

router.patch(
  '/api/student-confirm-lesson',
  authMiddleware(),
  new StudentController().confirmLessonRequest
);

// Login route
router.post('/api/login', AuthValidator.login(), new AuthController().login);

// Lesson Request route
router.post(
  '/api/lessonrequest',
  authMiddleware(),
  LessonRequestValidator.createLessonRequest(),
  new LessonRequestController().create
);

router.get(
  '/api/lessonrequest',
  authMiddleware(),
  new LessonRequestController().getAll
);

router.get(
  '/api/lessonrequest/:id',
  authMiddleware(),
  new LessonRequestController().getById
);

router.delete(
  '/api/lessonrequest/:id',
  new LessonRequestController().DeleteById
);

router.patch(
  '/api/lessonrequest/:lessonId',
  authMiddleware(),
  new LessonRequestController().updateLesson
);

// Subject route
router.post('/api/subject', authMiddleware(), new SubjectController().create);
router.get('/api/subject', authMiddleware(), new SubjectController().getAll);
export default router;
