import { Request, Response } from 'express';
import { StudentService } from '../service/StudentService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class StudentController {
  /**
   * @swagger
   * /api/register/student:
   *   post:
   *     summary: Creation of a new student
   *     tags: [Student]
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               fullName:
   *                 type: string
   *                 description: Full name of the student
   *                 example: "Nome do Estudante"
   *               username:
   *                 type: string
   *                 description: Username of the student
   *                 example: "nomeestudante"
   *               birthDate:
   *                 type: string
   *                 description: Birth date
   *                 example: "01/03/2001"
   *               email:
   *                 type: string
   *                 description: Email address of the student
   *                 example: "nomeestudante@exemplo.com"
   *               educationLevelId:
   *                 type: array
   *                 items:
   *                   type: integer
   *                 description: List of education level ID
   *                 example: [1]
   *               password:
   *                 type: string
   *                 description: Password of the student
   *                 example: "P@ssword123"
   *               confirmPassword:
   *                 type: string
   *                 description: Confirmation password of the student
   *                 example: "P@ssword123"
   *     responses:
   *       '201':
   *         description: Student successfully created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 fullName:
   *                   type: string
   *                   example: "Nome do Estudante"
   *                 username:
   *                   type: string
   *                   example: "nomeestudante"
   *                 birthDate:
   *                   type: string
   *                   example: "2000-01-01"
   *                 email:
   *                   type: string
   *                   example: "nomeestudante@exemplo.com"
   *                 educationLevel:
   *                   type: object
   *                   properties:
   *                     educationId:
   *                       type: integer
   *                       example: 1
   *                 studentId:
   *                   type: integer
   *                   example: 123
   *       '400':
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       type:
   *                         type: string
   *                         example: "field"
   *                       value:
   *                         type: string
   *                         example: ""
   *                       msg:
   *                         type: string
   *                         example: "Nome completo é obrigatório."
   *                       path:
   *                         type: string
   *                         example: "fullName"
   *                       location:
   *                         type: string
   *                         example: "body"
   *       '404':
   *         description: Not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Nível de ensino não encontrado."
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erro interno do servidor."
   *                 error:
   *                   type: string
   */
  async create(req: Request, res: Response) {
    try {
      const { user: savedStudent, token } = await StudentService.createStudent(
        req.body
      );

      return res.status(201).json({
        message: EnumSuccessMessages.STUDENT_CREATED,
        id: savedStudent.id,
        token: token
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/get/student:
   *   get:
   *     summary: Retrieve a list of all students
   *     tags: [Student]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: Successfully retrieved the list of students
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                     example: 1
   *                   username:
   *                     type: string
   *                     example: "nome_aluno_usuario1234"
   *                   fullName:
   *                     type: string
   *                     example: "Nome Aluno"
   *                   birthDate:
   *                     type: string
   *                     example: "2001-03-19"
   *                   educationLevel:
   *                     type: object
   *                     properties:
   *                       educationId:
   *                         type: integer
   *                         example: 1
   *                       levelType:
   *                         type: string
   *                         example: "Fundamental"
   *                   lessonRequests:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         ClassId:
   *                           type: integer
   *                           example: 14
   *                         reason:
   *                           type: array
   *                           items:
   *                             type: string
   *                             example: "reforço"
   *                         preferredDates:
   *                           type: array
   *                           items:
   *                             type: string
   *                             example: "29/12/2025 às 23:45"
   *                         status:
   *                           type: string
   *                           example: "pendente"
   *                         additionalInfo:
   *                           type: string
   *                           example: "Looking for a tutor with experience in calculus."
   *       '401':
   *         description: Unauthorized, missing or invalid token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Token inválido."
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erro interno do servidor."
   */
  async getAll(req: Request, res: Response) {
    try {
      const students = await StudentService.getAllStudents();
      return res.status(200).json(students);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/get/student/{id}:
   *   get:
   *     summary: Retrieve a student by ID
   *     tags: [Student]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the student to retrieve
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: Successfully retrieved the student by id
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 username:
   *                   type: string
   *                   example: "nome_aluno_usuario1234"
   *                 fullName:
   *                   type: string
   *                   example: "Nome Aluno"
   *                 birthDate:
   *                   type: string
   *                   example: "2001-03-19"
   *                 educationLevel:
   *                   type: object
   *                   properties:
   *                     educationId:
   *                       type: integer
   *                       example: 1
   *                     levelType:
   *                       type: string
   *                       example: "Fundamental"
   *                 lessonRequests:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       ClassId:
   *                         type: integer
   *                         example: 14
   *                       reason:
   *                         type: array
   *                         items:
   *                           type: string
   *                           example: "reforço"
   *                       preferredDates:
   *                         type: array
   *                         items:
   *                           type: string
   *                           example: "29/12/2025 às 23:45"
   *                       status:
   *                         type: string
   *                         example: "pendente"
   *                       additionalInfo:
   *                         type: string
   *                         example: "Looking for a tutor with experience in calculus."
   *       '404':
   *         description: Student not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Estudante não encontrado."
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erro interno do servidor."
   */
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const student = await StudentService.getStudentById(Number(id));

      const formattedStudent = {
        id: student.id,
        username: student.username,
        email: student.email,
        fullName: student.fullName,
        birthDate: student.birthDate,
        educationLevel: student.educationLevel,
        lessonRequests: student.lessonRequests
      };

      return res.status(200).json(formattedStudent);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  async getPendingLessonByStudentId(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lessons = await StudentService.getPendingLessonByStudentId(
        Number(id)
      );
      return res.status(200).json(lessons);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
