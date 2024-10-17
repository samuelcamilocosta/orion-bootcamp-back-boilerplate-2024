import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { TutorController } from './controller/TutorController';
import { TutorValidator } from './validator/TutorValidator';
import { StudentValidator } from './validator/StudentValidator';
import { StudentController } from './controller/StudentController';
import { EducationLevelController } from './controller/EducationLevelController';

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

export default router;
