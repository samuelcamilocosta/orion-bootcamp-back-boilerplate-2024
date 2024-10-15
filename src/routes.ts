import { Router } from 'express';
import { HomeController } from './controller/HomeController';
import { TutorController } from './controller/TutorController';
import { TutorValidator } from './validator/TutorValidator';

const router = Router();

router.get('/', new HomeController().hello);

router.post(
  '/api/register/tutor',
  TutorValidator.createTutor(),
  new TutorController().create
);

export default router;
