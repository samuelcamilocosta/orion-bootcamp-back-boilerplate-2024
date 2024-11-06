import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';
import { Student } from '../entity/Student';
import { AuthService } from '../service/AuthService';

export class StudentController {
  /**
   * @swagger
   * /api/register/student:
   *   post:
   *     summary: Creation of a new student
   *     tags: [student]
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
   *                 message:
   *                   type: string
   *                   example: "Aluno criado com sucesso."
   *                 studentId:
   *                   type: integer
   *                   example: 123
   *                 token:
   *                   type: string
   *                   description: Token JWT para autenticação
   *                   example: "eyJhbGciOiJIUzI1NiIsInR..."
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

      const token = AuthService.generateToken(student.id, student.email, "student");

      return res.status(201).json({
        message: "Aluno criado com sucesso.",
        id: student.id,
        token: token
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const student = await MysqlDataSource.getRepository(Student).find({
        select: ['id', 'username', 'email', 'fullName']
      });
      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
