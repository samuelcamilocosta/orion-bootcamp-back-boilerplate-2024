import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { TutorController } from './controller/TutorController';
import { TutorValidator } from './validator/TutorValidator';
import { StudentValidator } from './validator/StudentValidator';
import { StudentController } from './controller/StudentController';
import { EducationLevelController } from './controller/EducationLevelController';
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
  TutorValidator.createTutor(),
  new TutorController().create
);

router.get('/api/get/tutor', new TutorController().getAll);

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

export default router;
