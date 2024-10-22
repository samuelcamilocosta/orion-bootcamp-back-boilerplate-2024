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
  authMiddleware(),
  new EducationLevelController().getAll
);

// Login route
router.post(
  '/api/login',
  cors(),
  AuthValidator.login(),
  new AuthController().login
);

export default router;
