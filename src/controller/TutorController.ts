import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { EducationLevel } from '../entity/EducationLevel';
import { validationResult } from 'express-validator';

export class TutorController {
  /**
   * @swagger
   * /api/register/tutor:
   *   post:
   *     summary: Creation of a new tutor
   *     tags: [tutor]
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
   *                 description: Full name of the tutor
   *                 example: "Nome Tutor"
   *               username:
   *                 type: string
   *                 description: Username of the tutor
   *                 example: "nometutor"
   *               birthDate:
   *                 type: string
   *                 description: Birth date in the format YYYY-MM-DD
   *                 example: "1990-01-01"
   *               email:
   *                 type: string
   *                 description: Email address of the tutor
   *                 example: "nometutor@exemplo.com"
   *               cpf:
   *                 type: string
   *                 description: CPF of the tutor
   *                 example: "123.456.789-10"
   *               educationLevel:
   *                 type: array
   *                 items:
   *                   type: integer
   *                 description: List of education level IDs
   *                 example: [1, 2]
   *               password:
   *                 type: string
   *                 description: Password of the tutor
   *                 example: "P@ssword123"
   *               confirmPassword:
   *                 type: string
   *                 description: Confirmation password of the tutor
   *                 example: "P@ssword123"
   *     responses:
   *       '201':
   *         description: Tutor successfully created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 fullName:
   *                   type: string
   *                 username:
   *                   type: string
   *                 birthDate:
   *                   type: string
   *                 email:
   *                   type: string
   *                 cpf:
   *                   type: string
   *                 educationLevels:
   *                   type: array
   *                   items:
   *                     type: integer
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
   *                         example: "117.629.360-54"
   *                       msg:
   *                         type: string
   *                         example: "CPF já cadastrado."
   *                       path:
   *                         type: string
   *                         example: "cpf"
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
   *                 error:
   *                   type: string
   */
  async create(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Received request to save tutor:', req.body);

    const {
      fullName,
      username,
      birthDate,
      email,
      cpf,
      educationLevel,
      password
    } = req.body;

    const { hashedPassword, salt } = password;

    const tutor = new Tutor();
    tutor.fullName = fullName;
    tutor.username = username;
    tutor.birthDate = birthDate;
    tutor.password = hashedPassword;
    tutor.email = email;
    tutor.cpf = cpf;
    tutor.salt = salt;

    try {
      const foundEducationLevels =
        await MysqlDataSource.getRepository(EducationLevel).findByIds(
          educationLevel
        );
      console.log('Found education levels:', foundEducationLevels);

      if (foundEducationLevels) {
        tutor.educationLevels = foundEducationLevels;
        console.log('Saved tutor education levels', tutor.educationLevels);
      }

      await MysqlDataSource.getRepository(Tutor).save(tutor);

      return res.status(201).json(tutor);
    } catch (error) {
      console.error('Error saving tutor:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }
}
