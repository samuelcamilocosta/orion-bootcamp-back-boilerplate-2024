import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';
import { Student } from '../entity/Student';
import { AuthService } from '../service/AuthService';

export class StudentController {
  async create(req: Request, res: Response) {
    const { fullName, username, birthDate, password, email, educationLevelId } =
      req.body;

    const { hashedPassword, salt } = password;

    const student = new Student();
    student.fullName = fullName;
    student.username = username;
    student.birthDate = birthDate;
    student.password = hashedPassword;
    student.email = email;
    student.salt = salt;

    try {
      const foundEducationLevel = await MysqlDataSource.getRepository(
        EducationLevel
      ).findOne({
        where: { educationId: educationLevelId }
      });

      if (foundEducationLevel) {
        student.educationLevel = foundEducationLevel;
      }

      await MysqlDataSource.getRepository(Student).save(student);

      const token = AuthService.generateToken(
        student.id,
        student.email,
        'student'
      );

      return res.status(201).json({
        message: 'Aluno criado com sucesso.',
        id: student.id,
        token: token
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error });
    }
  }

  /**
   * @swagger
   * /api/get/student:
   *   get:
   *     summary: Retrieve a list of all students
   *     tags: [student]
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
   *                     example: 2
   *                   username:
   *                     type: string
   *                     example: "nome_aluno_usuario1234"
   *                   email:
   *                     type: string
   *                     example: "nome_aluno1234@exemplo.com"
   *                   fullName:
   *                     type: string
   *                     example: "nome_aluno1234"
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
      const student = await MysqlDataSource.getRepository(Student).find({
        select: [
          'id',
          'username',
          'email',
          'fullName',
          'educationLevel',
          'lessonRequests'
        ],
        relations: ['educationLevel', 'lessonRequests']
      });
      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  /**
   * @swagger
   * /api/get/student/{id}:
   *   get:
   *     summary: Retrieve a student by ID
   *     tags: [student]
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
   *                 email:
   *                   type: string
   *                   example: "nome_aluno1234@exemplo.com"
   *                 fullName:
   *                   type: string
   *                   example: "nome_aluno1234"
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

      const student = await MysqlDataSource.getRepository(Student).findOne({
        where: { id: Number(id) },
        select: [
          'id',
          'username',
          'email',
          'fullName',
          'educationLevel',
          'lessonRequests'
        ],
        relations: ['educationLevel', 'lessonRequests']
      });

      if (!student) {
        return res.status(404).json({ message: 'Estudante não encontrado.' });
      }

      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
