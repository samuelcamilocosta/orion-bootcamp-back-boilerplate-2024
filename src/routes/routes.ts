import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { AuthController } from '../controller/AuthController';
import { StudentController } from '../controller/ProfileController';

const router = Router();

const userController = new UserController();
const authController = new AuthController();
const studentController = new StudentController();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API para gestão de usuários
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cadastrar um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Email já cadastrado ou inválido
 *       500:
 *         description: Erro ao criar usuário
 */
router.post('/api/users', userController.createUser.bind(userController));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       400:
 *         description: Credenciais inválidas
 */
router.post('/api/auth/login', authController.login.bind(authController));

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API para gestão de alunos
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Cadastrar um novo aluno
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao cadastrar aluno
 */
router.post(
  '/api/students',
  studentController.createStudent.bind(studentController),
);

export default router;
