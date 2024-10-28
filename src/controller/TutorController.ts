import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { EducationLevel } from '../entity/EducationLevel';
import { In } from 'typeorm';

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
   *                 example: "01/01/1990"
   *               email:
   *                 type: string
   *                 description: Email address of the tutor
   *                 example: "nometutor@exemplo.com"
   *               cpf:
   *                 type: string
   *                 description: CPF of the tutor
   *                 example: "388.229.490-64"
   *                 example: "388.229.490-64"
   *               educationLevelId:
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
   *                 educationLevel:
   *                   type: array
   *                   items:
   *                     type: integer
   *                 tutorId:
   *                   type: integer
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
   *                   example: "Erro interno do servidor."
   *                 error:
   *                   type: string
   */
  async create(req: Request, res: Response) {
    const {
      fullName,
      username,
      birthDate,
      email,
      cpf,
      educationLevelId,
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
      const foundEducationLevel = await MysqlDataSource.getRepository(
        EducationLevel
      ).find({
        where: { educationId: In(educationLevelId) }
      });

      if (foundEducationLevel) {
        tutor.educationLevels = foundEducationLevel;
      }

      await MysqlDataSource.getRepository(Tutor).save(tutor);

      return res.status(201).json({
        fullName: tutor.fullName,
        username: tutor.username,
        birthDate: tutor.birthDate,
        email: tutor.email,
        educationLevel: tutor.educationLevels,
        cpf: tutor.cpf,
        id: tutor.id
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const tutor = await MysqlDataSource.getRepository(Tutor).find({
        select: ['username', 'email', 'fullName']
      });
      return res.status(200).json(tutor);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
