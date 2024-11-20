import { Request, Response } from 'express';
import { EducationLevelService } from '../service/EducationLevelService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

export class EducationLevelController {
  /**
   * @swagger
   * /api/register/educationLevel:
   *   post:
   *     summary: Create a new education level
   *     tags: [Education Level]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               levelType:
   *                 type: string
   *                 enum: [fundamental, medio, pre-vestibular]
   *                 description: Type of education level
   *     responses:
   *       '201':
   *         description: Education level created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 educationId:
   *                   type: integer
   *                   example: 1
   *                 levelType:
   *                   type: string
   *                   example: "Fundamental"
   *                 message:
   *                   type: string
   *                   example: "Nível de ensino criado com sucesso!"
   *       '400':
   *         description: Level type is required
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Nível de ensino é obrigatório."
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
    const { levelType } = req.body;

    try {
      const educationLevel =
        await EducationLevelService.createEducationLevel(levelType);
      return res.status(201).json({
        educationLevel,
        message: EnumSuccessMessages.EDUCATION_LEVEL_CREATED
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/get/educationLevel:
   *   get:
   *     summary: Get all education levels
   *     tags: [Education Level]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of education levels retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   educationId:
   *                     type: integer
   *                     example: 1
   *                   levelType:
   *                     type: string
   *                     example: "Fundamental"
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
      const educationLevels =
        await EducationLevelService.getAllEducationLevels();
      return res.status(200).json(educationLevels);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
