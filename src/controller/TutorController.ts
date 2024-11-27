import { Request, Response } from 'express';
import { TutorService } from '../service/TutorService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';
import { HttpRoute } from '../decorators/HttpRoute';

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
   *                 id:
   *                   type: integer
   *                   example: 1
   *                 username:
   *                   type: string
   *                   example: "nometutor"
   *                 fullName:
   *                   type: string
   *                   example: "Nome Tutor"
   *                 photoUrl:
   *                   type: string
   *                   example: "https://example.com/photo.jpg"
   *                 birthDate:
   *                   type: string
   *                   example: "01/01/1990"
   *                 expertise:
   *                   type: string
   *                   example: "Matemática"
   *                 projectReason:
   *                   type: string
   *                   example: "Ajudar os alunos"
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
   *                 token:
   *                   type: string
   *                   example: "token_de_autenticacao"
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
   *       '404':
   *         description: Not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Um ou mais níveis de ensino não encontrados."
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
  @HttpRoute({ path: '/api/register/tutor', method: 'post' })
  async create(req: Request, res: Response) {
    try {
      const { user: savedTutor, token } = await TutorService.createTutor(
        req.body
      );

      return res.status(201).json({
        message: EnumSuccessMessages.TUTOR_CREATED,
        tutorId: savedTutor.id,
        token: token
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
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
   *                   fullName:
   *                     type: string
   *                     example: "nome_tutor01"
   *                   photoUrl:
   *                     type: string
   *                     example: "https://orion-photos.s3.sa-east-1.amazonaws.com/nome_tutor01.jpg"
   *                   birthDate:
   *                     type: string
   *                     example: "2001-03-19"
   *                   expertise:
   *                     type: string
   *                     example: "Matemática"
   *                   projectReason:
   *                     type: string
   *                     example: "Ajudar os alunos"
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
   *       '404':
   *         description: Not found
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
  @HttpRoute({ path: '/api/get/tutor', method: 'get' })
  async getAll(req: Request, res: Response) {
    try {
      const tutors = await TutorService.getAllTutors();
      return res.status(200).json(tutors);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
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
   *                 example: 1
   *               expertise:
   *                 type: string
   *                 maxLength: 50
   *                 description: Tutor's area of expertise
   *                 example: "Matemática"
   *               projectReason:
   *                 type: string
   *                 maxLength: 200
   *                 description: Reason for joining the project
   *                 example: "Ajudar os alunos a entender melhor os conceitos matemáticos"
   *               subject:
   *                 type: array
   *                 items:
   *                   type: integer
   *                 description: Array of subject IDs
   *                 example: [1, 2]
   *     responses:
   *       '200':
   *         description: Tutor updated successfully
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
   *                   example: "nometutor"
   *                 fullName:
   *                   type: string
   *                   example: "Nome Tutor"
   *                 photoUrl:
   *                   type: string
   *                   example: "https://example.com/photo.jpg"
   *                 birthDate:
   *                   type: string
   *                   example: "01/01/1990"
   *                 expertise:
   *                   type: string
   *                   example: "Matemática"
   *                 projectReason:
   *                   type: string
   *                   example: "Ajudar os alunos"
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
  @HttpRoute({ path: '/api/update/tutor', method: 'patch' })
  async updatePersonalData(req: Request, res: Response) {
    try {
      const { id, expertise, projectReason, subject: subjectIds } = req.body;

      const tutor = await TutorService.getTutorById(id);

      await TutorService.updateTutorPersonalData(
        tutor,
        expertise,
        projectReason,
        subjectIds
      );

      return res
        .status(200)
        .json({ message: EnumSuccessMessages.TUTOR_UPDATED });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
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
   *                 description: ID of the tutor
   *                 example: 1
   *     responses:
   *       '200':
   *         description: Photo updated successfully
   *         example: "Foto atualizada com sucesso!"
   *       '400':
   *         description: Bad request, missing or invalid data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Arquivo de foto é obrigatório."
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
  @HttpRoute({ path: '/api/update/tutor/photo', method: 'patch' })
  async updatePhoto(req: Request, res: Response) {
    try {
      const { id } = req.body;
      const tutor = await TutorService.getTutorById(id);
      await TutorService.updateTutorPhoto(tutor, req.file);

      return res.status(200).json({
        message: EnumSuccessMessages.PHOTO_UPDATED
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
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
   *                   example: "testeTutor2"
   *                 fullName:
   *                   type: string
   *                   example: "testeTutor"
   *                 photoUrl:
   *                   type: string
   *                   nullable: true
   *                   example: "https://orion-photos.s3.sa-east-1.amazonaws.com/nome_tutor01.jpg"
   *                 birthDate:
   *                   type: string
   *                   example: "2001-03-19"
   *                 expertise:
   *                   type: string
   *                   nullable: true
   *                   example: null
   *                 projectReason:
   *                   type: string
   *                   nullable: true
   *                   example: null
   *                 educationLevels:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       educationId:
   *                         type: integer
   *                         example: 2
   *                       levelType:
   *                         type: string
   *                         example: "Médio"
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
  @HttpRoute({ path: '/api/get/tutor/:id', method: 'get' })
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const tutor = await TutorService.getTutorById(Number(id));
      return res.status(200).json(tutor);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
