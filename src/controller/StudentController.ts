import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';
import { validationResult } from 'express-validator';
import { Student } from '../entity/Student';

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
   *               educationLevel:
   *                 type: integer
   *                 description: ID of the education level
   *                 example: 1
   *               password:
   *                 type: string
   *                 description: Password of the student
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
   *                 salt:
   *                   type: string
   *                   example: "randomSaltString"
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
   *                         example: "invalid_value"
   *                       msg:
   *                         type: string
   *                         example: "Field is required."
   *                       path:
   *                         type: string
   *                         example: "fieldName"
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
   *                   example: "Internal Server Error"
   *                 error:
   *                   type: string
   */
  async create(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, username, birthDate, password, email, educationLevel } =
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
        where: { educationId: educationLevel }
      });

      if (foundEducationLevel) {
        student.educationLevel = foundEducationLevel;
      }

      await MysqlDataSource.getRepository(Student).save(student);

      return res.status(201).json(student);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const student = await MysqlDataSource.getRepository(Student).find();
      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
