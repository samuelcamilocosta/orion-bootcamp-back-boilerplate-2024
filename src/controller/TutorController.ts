import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { In } from 'typeorm';
import { Subject } from '../entity/Subject';
import sharp from 'sharp';
import { randomImgName, s3, bucketName } from '../config/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { TutorService } from '../service/TutorService';

export class TutorController {
  /**
   * @swagger
   * /api/register/tutor:
   *   post:
   *     summary: Creation of a new tutor
   *     tags: [Tutor]
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
   *                 description: Birth date in the format DD/MM/YYYY
   *                 example: "01/01/1990"
   *               email:
   *                 type: string
   *                 description: Email address of the tutor
   *                 example: "nometutor@exemplo.com"
   *               cpf:
   *                 type: string
   *                 description: CPF of the tutor
   *                 example: "123.456.789-10"
   *               educationLevelIds:
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
    try {
      const { user: savedTutor, token } = await TutorService.createTutor(
        req.body
      );

      return res.status(201).json({
        message: 'Tutor criado com sucesso.',
        tutorId: savedTutor.id,
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
   * /api/get/tutor:
   *   get:
   *     summary: Get all tutors
   *     tags: [Tutor]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of tutors retrieved successfully
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
   *                     example: "usuario_tutor01"
   *                   email:
   *                     type: string
   *                     example: "usuario_tutor01@exemplo.com"
   *                   fullName:
   *                     type: string
   *                     example: "nome_tutor01"
   *                   cpf:
   *                     type: string
   *                     example: "63806240078"
   *                   photoUrl:
   *                     type: string
   *                     example: "https://orion-photos.s3.sa-east-1.amazonaws.com/nome_tutor01.jpg"
   *                   educationLevels:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         educationId:
   *                           type: integer
   *                           example: 1
   *                         levelType:
   *                           type: string
   *                           example: "Fundamental"
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
   *                   subjects:
   *                     type: array
   *                     items:
   *                       type: object
   *                       properties:
   *                         subjectId:
   *                           type: integer
   *                           example: 1
   *                         subjectName:
   *                           type: string
   *                           example: "Biologia"
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
      const tutors = await TutorService.getAllTutors();
      return res.status(200).json(tutors);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  /**
   * @swagger
   * /api/update/tutor:
   *   patch:
   *     summary: Update tutor personal data
   *     tags: [Tutor]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *                 description: Tutor ID
   *               expertise:
   *                 type: string
   *                 maxLength: 50
   *                 description: Tutor's area of expertise
   *               projectReason:
   *                 type: string
   *                 maxLength: 200
   *                 description: Reason for joining the project
   *               subject:
   *                 type: array
   *                 items:
   *                   type: integer
   *                 description: Array of subject IDs
   *     responses:
   *       '200':
   *         description: Tutor updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Tutor atualizado com sucesso"
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
   *       '404':
   *         description: Tutor not found
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
  async updatePersonalData(req: Request, res: Response) {
    const { expertise, projectReason, subject: subjectIds, id } = req.body;

    try {
      const tutorRepository = MysqlDataSource.getRepository(Tutor);
      const tutor = await tutorRepository.findOne({
        where: { id },
        relations: ['subjects']
      });

      if (!tutor) {
        return res.status(404).json({ message: 'Tutor não encontrado' });
      }

      tutor.expertise = expertise ?? tutor.expertise;
      tutor.projectReason = projectReason ?? tutor.projectReason;

      if (Array.isArray(subjectIds) && subjectIds.length > 0) {
        const foundSubjects = await MysqlDataSource.getRepository(
          Subject
        ).findBy({
          subjectId: In(subjectIds)
        });

        tutor.subjects =
          foundSubjects.length > 0 ? foundSubjects : tutor.subjects;
      }

      await tutorRepository.save(tutor);

      return res.status(200).json({ message: 'Tutor atualizado com sucesso' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao atualizar o tutor', error });
    }
  }

  /**
   * @swagger
   * /api/update/tutor/photo:
   *   patch:
   *     summary: Update tutor photo
   *     tags: [Tutor]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               id:
   *                 type: integer
   *     responses:
   *       '200':
   *         description: Photo updated successfully
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
  async updatePhoto(req: Request, res: Response) {
    const { id } = req.body;

    let buffer: Buffer;

    try {
      buffer = await sharp(req.file.buffer)
        .resize({
          height: 300,
          width: 300,
          fit: 'cover'
        })
        .toBuffer();
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao processar a imagem', error });
    }

    try {
      const randomName = randomImgName();
      const params = {
        Bucket: bucketName,
        Key: randomName,
        Body: buffer,
        ContentType: req.file.mimetype
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const tutorRepository = MysqlDataSource.getRepository(Tutor);
      const tutor = await tutorRepository.findOne({ where: { id } });

      if (!tutor) {
        return res.status(404).json({ message: 'Tutor não encontrado' });
      }
      const photoUrl = `https://orion-photos.s3.sa-east-1.amazonaws.com/${randomName}`;
      tutor.photoUrl = photoUrl;
      await tutorRepository.save(tutor);

      return res.status(200).json({ message: 'Foto atualizada com sucesso' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao atualizar a foto', error });
    }
  }

  /**
   * @swagger
   * /api/get/tutor/{id}:
   *   get:
   *     summary: Get tutor by ID
   *     tags: [Tutor]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the tutor
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: Tutor data retrieved successfully
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
   *                   example: "usuario_tutor01"
   *                 email:
   *                   type: string
   *                   example: "usuario_tutor01@exemplo.com"
   *                 fullName:
   *                   type: string
   *                   example: "nome_tutor01"
   *                 cpf:
   *                   type: string
   *                   example: "63806240078"
   *                 educationLevels:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       educationId:
   *                         type: integer
   *                         example: 1
   *                       levelType:
   *                         type: string
   *                         example: "Fundamental"
   *                   photoUrl:
   *                     type: string
   *                     example: "https://orion-photos.s3.sa-east-1.amazonaws.com/nome_tutor01.jpg"
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
   *                 subjects:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       subjectId:
   *                         type: integer
   *                         example: 1
   *                       subjectName:
   *                         type: string
   *                         example: "Mathematics"
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
   *       '404':
   *         description: Tutor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Tutor não encontrado."
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
    const { id } = req.params;

    try {
      const tutor = await MysqlDataSource.getRepository(Tutor).findOne({
        where: { id: Number(id) },
        select: [
          'id',
          'cpf',
          'username',
          'email',
          'fullName',
          'educationLevels',
          'photoUrl',
          'lessonRequests',
          'subjects'
        ],
        relations: ['educationLevels', 'lessonRequests', 'subjects']
      });

      if (!tutor) {
        return res.status(404).json({ message: 'Tutor não encontrado.' });
      }

      return res.status(200).json(tutor);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
