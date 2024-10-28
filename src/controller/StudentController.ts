import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';
import { validationResult } from 'express-validator';
import { Student } from '../entity/Student';

export class StudentController {
  async create(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, username, birthDate, email, educationLevel, password } =
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
      const foundEducationLevels = await MysqlDataSource.getRepository(
        EducationLevel
      ).findOne({
        where: { educationId: educationLevel }
      });

      if (foundEducationLevels) {
        student.educationLevel = foundEducationLevels;
      }

      await MysqlDataSource.getRepository(Student).save(student);
      return res.status(201).json({
        email: student.email,
        password: student.password
      });
    } catch (error) {
      console.error('Error saving student:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
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
   *         description: A list of students
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   username:
   *                     type: string
   *                     example: "nomeestudante"
   *                   email:
   *                     type: string
   *                     example: "nome_aluno445@exemplo.com"
   *                   fullName:
   *                     type: string
   *                     example: "Nome Estudante"
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
   */
  async getAll(req: Request, res: Response) {
    try {
      const student = await MysqlDataSource.getRepository(Student).find({
        select: ['username', 'email', 'fullName']
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
   *         description: A student object
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
   *                   example: "nomeestudante"
   *                 email:
   *                   type: string
   *                   example: "nome_aluno445@exemplo.com"
   *                 fullName:
   *                   type: string
   *                   example: "Nome Estudante"
   *                 educationLevel:
   *                   type: integer
   *                   example: 1
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
   *         description: Server error
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
        relations: ['educationLevel']
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
