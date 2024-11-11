import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';

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

    if (!levelType) {
      return res
        .status(400)
        .json({ message: 'Nível de ensino é obrigatório.' });
    }

    const educationLevel = new EducationLevel();
    educationLevel.levelType = levelType;

    try {
      await MysqlDataSource.getRepository(EducationLevel).save(educationLevel);
      return res.status(201).json(educationLevel);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error });
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
   *                   levelType:
   *                     type: string
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
        await MysqlDataSource.getRepository(EducationLevel).find();
      return res.status(200).json(educationLevels);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
