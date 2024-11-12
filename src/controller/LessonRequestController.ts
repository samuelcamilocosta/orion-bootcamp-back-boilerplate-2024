import { Request, Response } from 'express';
import { LessonRequestService } from '../service/LessonRequestService';

export class LessonRequestController {
  /**
   * @swagger
   * /api/register/lessonrequest:
   *   post:
   *     summary: Create a new lesson request
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               reason:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Reasons for the lesson
   *                 example: ["reforço", "prova ou trabalho"]
   *               preferredDates:
   *                 type: array
   *                 items:
   *                   type: string
   *                 description: Preferred dates for the lesson
   *                 example: ["22/12/2024 às 10:00"]
   *               subjectId:
   *                 type: integer
   *                 description: ID of the subject
   *                 example: 1
   *               additionalInfo:
   *                 type: string
   *                 description: Additional information
   *                 maxLength: 200
   *                 example: "Informações adicionais"
   *               studentId:
   *                 type: integer
   *                 description: ID of the student
   *                 example: 1
   *     responses:
   *       '201':
   *         description: Lesson request created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Seu pedido de aula foi enviado com sucesso!"
   *                 lessonRequest:
   *                   type: object
   *                   properties:
   *                     reason:
   *                       type: array
   *                       items:
   *                         type: string
   *                     preferredDates:
   *                       type: array
   *                       items:
   *                         type: string
   *                     additionalInfo:
   *                       type: string
   *                     status:
   *                       type: string
   *                     subject:
   *                       type: object
   *                       properties:
   *                         subjectId:
   *                           type: integer
   *                         subjectName:
   *                           type: string
   *                     student:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                         username:
   *                           type: string
   *                         email:
   *                           type: string
   *                         password:
   *                           type: string
   *                         salt:
   *                           type: string
   *                         fullName:
   *                           type: string
   *                         birthDate:
   *                           type: string
   *                           format: date
   *                     ClassId:
   *                       type: integer
   *       '400':
   *         description: Bad request, validation errors
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: object
   *                   properties:
   *                     errors:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           type:
   *                             type: string
   *                             example: "field"
   *                           value:
   *                             type: array
   *                             items:
   *                               type: string
   *                             example: ["wrong reason"]
   *                           msg:
   *                             type: string
   *                             example: "Motivo da aula inválido. Deve conter ao menos um desses: reforço, prova ou trabalho, correção de exercício, outro."
   *                           path:
   *                             type: string
   *                             example: "reason"
   *                           location:
   *                             type: string
   *                             example: "body"
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
      await LessonRequestService.createLessonRequest(req.body);

      return res.status(201).json({
        message: 'Seu pedido de aula foi enviado com sucesso!',
        lessonRequest: req.body
      });
    } catch (error) {
      if (error.message === 'Matéria não encontrada.') {
        return res.status(404).json({ message: 'Matéria não encontrada.' });
      }
      if (error.message === 'Aluno não encontrado.') {
        return res.status(404).json({ message: 'Aluno não encontrado.' });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  /**
   * @swagger
   * /api/get/lessonrequest:
   *   get:
   *     summary: Retrieve all lesson requests
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       '200':
   *         description: List of lesson requests retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   classId:
   *                     type: integer
   *                   reason:
   *                     type: array
   *                     items:
   *                       type: string
   *                   preferredDates:
   *                     type: array
   *                     items:
   *                       type: string
   *                   status:
   *                     type: string
   *                   additionalInfo:
   *                     type: string
   *                   subjectId:
   *                     type: integer
   *                   studentId:
   *                     type: integer
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
      const lessonRequests = await LessonRequestService.getAllLessonRequests();

      return res.status(200).json(lessonRequests);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  /**
   * @swagger
   * /api/get/lessonrequest/{id}:
   *   get:
   *     summary: Retrieve a lesson request by ID
   *     tags: [Lesson Request]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the lesson request
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: Lesson request retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 ClassId:
   *                   type: integer
   *                   example: 1
   *                 reason:
   *                   type: array
   *                   items:
   *                     type: string
   *                   example: ["reforço"]
   *                 preferredDates:
   *                   type: array
   *                   items:
   *                     type: string
   *                     format: date
   *                   example: ["2023-10-01", "2023-10-02"]
   *                 status:
   *                   type: string
   *                   example: "pendente"
   *                 additionalInfo:
   *                   type: string
   *                   example: "Looking for a tutor with experience in calculus."
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
   *      '404':
   *         description: Lesson request not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aula não encontrada."
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
    const { id } = req.params;

    try {
      const lesson = await LessonRequestService.getLessonRequestById(
        Number(id)
      );

      return res.status(200).json(lesson);
    } catch (error) {
      if (error.message === 'Aula não encontrada.') {
        return res.status(404).json({ message: 'Aula não encontrada.' });
      }
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
