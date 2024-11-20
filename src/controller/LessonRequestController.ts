import { Request, Response } from 'express';
import { LessonRequestService } from '../service/LessonRequestService';
import { handleError } from '../utils/ErrorHandler';
import { EnumSuccessMessages } from '../enum/EnumSuccessMessages';

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
   *                   enum: ['reforço', 'prova ou trabalho', 'correção de exercício', 'outro']
   *                 example: ["reforço"]
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
   *                 example: "Looking for a tutor with experience in calculus."
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
   *                   example: "Aula criada com sucesso!"
   *                 lessonRequest:
   *                   type: object
   *                   properties:
   *                     reason:
   *                       type: array
   *                       items:
   *                         type: string
   *                       example: ["reforço"]
   *                     preferredDates:
   *                       type: array
   *                       items:
   *                         type: string
   *                       example: ["2025-12-25 23:45"]
   *                     additionalInfo:
   *                       type: string
   *                       example: "Looking for a tutor with experience in calculus."
   *                     status:
   *                       type: string
   *                       example: "pendente"
   *                     subject:
   *                       type: object
   *                       properties:
   *                         subjectId:
   *                           type: integer
   *                           example: 1
   *                         subjectName:
   *                           type: string
   *                           example: "Biologia"
   *                     student:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                           example: 2
   *                         username:
   *                           type: string
   *                           example: "Jose123"
   *                         fullName:
   *                           type: string
   *                           example: "Jose Silva"
   *                         birthDate:
   *                           type: string
   *                           format: date
   *                           example: "2001-03-19"
   *                         educationLevel:
   *                           type: object
   *                           properties:
   *                             educationId:
   *                               type: integer
   *                               example: 1
   *                             levelType:
   *                               type: string
   *                               example: "Fundamental"
   *                     ClassId:
   *                       type: integer
   *                       example: 12
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
   *       '404':
   *         description: Not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Aluno não encontrado."
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
      const lessonRequest = await LessonRequestService.createLessonRequest(
        req.body
      );

      return res.status(201).json({
        message: EnumSuccessMessages.LESSON_REQUEST_CREATED,
        lessonRequest
      });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
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
   *                     example: 1
   *                   reason:
   *                     type: array
   *                     items:
   *                       type: string
   *                     example: ["reforço"]
   *                   preferredDates:
   *                     type: array
   *                     items:
   *                       type: string
   *                     example: ["29/12/2025 às 23:45"]
   *                   status:
   *                     type: string
   *                     example: "pendente"
   *                   additionalInfo:
   *                     type: string
   *                     example: "Looking for a tutor with experience in calculus."
   *                   subjectId:
   *                     type: integer
   *                     example: 1
   *                   studentId:
   *                     type: integer
   *                     example: 1
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
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/get/lessonrequest/{id}:
   *   get:
   *     summary: Get lesson request by ID
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
   *                     example: ["reforço"]
   *                 preferredDates:
   *                   type: array
   *                   items:
   *                     type: string
   *                     example: ["29/12/2025 às 23:45"]
   *                 status:
   *                   type: string
   *                   example: "pendente"
   *                 additionalInfo:
   *                   type: string
   *                   example: "Looking for a tutor with experience in calculus."
   *                 subject:
   *                   type: object
   *                   properties:
   *                     subjectId:
   *                       type: integer
   *                       example: 1
   *                     subjectName:
   *                       type: string
   *                       example: "Biologia"
   *                 student:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: integer
   *                       example: 1
   *                     username:
   *                       type: string
   *                       example: "teste123"
   *                     fullName:
   *                       type: string
   *                       example: "Teste"
   *                     birthDate:
   *                       type: string
   *                       format: date
   *                       example: "2001-03-19"
   *                 tutor:
   *                   type: object
   *                   nullable: true
   *                   example: null
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
      const lesson = await LessonRequestService.getLessonRequestById(
        Number(id)
      );

      return res.status(200).json(lesson);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }

  /**
   * @swagger
   * /api/delete/lessonrequest/{id}:
   *   delete:
   *     summary: Delete a lesson request by ID
   *     tags: [lesson]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the lesson request to delete
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '204':
   *         description: Lesson request deleted successfully
   *       '400':
   *         description: Invalid parameter
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Parâmetro inválido"
   *       '404':
   *         description: Lesson request not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Pedido de aula não existe"
   *       '500':
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Erro interno no servidor"
   */

  async DeleteById(req: Request, res: Response) {
    const classId = Number(req.params.id);

    if (isNaN(classId) || classId <= 0) {
      return res.status(400).json({ message: 'Parâmetro inválido' });
    }

    try {
      const deletedRequest = await LessonRequestService.deleteLessonRequestById(
        Number(classId)
      );
      return res.status(204).end().json({ deletedRequest });
    } catch (error) {
      const { statusCode, message } = handleError(error);
      return res.status(statusCode).json({ message });
    }
  }
}
