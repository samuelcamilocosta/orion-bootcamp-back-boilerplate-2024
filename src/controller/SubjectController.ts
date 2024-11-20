import { Request, Response } from 'express';
import { SubjectService } from '../service/SubjectService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class SubjectController {
  /**
   * @swagger
   * /api/register/subject:
   *   post:
   *     summary: Create a new subject
   *     tags: [Subject]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               subjectName:
   *                 type: string
   *                 description: Name of the subject
   *                 example: "Matemática"
   *     responses:
   *       '201':
   *         description: Subject created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Matéria criada com sucesso!"
   *       '400':
   *         description: Subject name is required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Nome da matéria é obrigatório."
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
  async create(req: Request, res: Response) {
    try {
      const { subjectName } = req.body;
      await SubjectService.createSubject(subjectName);
      return res
        .status(201)
        .json({ message: EnumSuccessMessages.SUBJECT_CREATED });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/get/subject:
   *   get:
   *     summary: Get all subjects
   *     tags: [Subject]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of subjects retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   subjectId:
   *                     type: integer
   *                     example: 1
   *                   subjectName:
   *                     type: string
   *                     example: "Matemática"
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
      const subjects = await SubjectService.getAllSubjects();
      return res.status(200).json(subjects);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
