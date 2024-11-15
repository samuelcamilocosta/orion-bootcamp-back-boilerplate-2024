import { Subject } from '../entity/Subject';
import { MysqlDataSource } from '../config/database';
import { Request, Response } from 'express';

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
   *                   example: "Erro interno no servidor"
   */
  async create(req: Request, res: Response) {
    const { subjectName } = req.body;

    const subject = new Subject();
    subject.subjectName = subjectName;

    try {
      await MysqlDataSource.getRepository(Subject).save(subject);

      return res.status(201).json({ message: 'Matéria criada com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno no servidor' });
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
   *                   example: "Internal Server Error"
   */
  async getAll(req: Request, res: Response) {
    try {
      const subject = await MysqlDataSource.getRepository(Subject).find({
        select: ['subjectId', 'subjectName']
      });
      return res.status(200).json(subject);
    } catch (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
