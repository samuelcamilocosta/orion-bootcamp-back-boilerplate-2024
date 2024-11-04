import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';
import { Request, Response } from 'express';
import { StatusName } from '../entity/enum/StatusName';
import { Subject } from '../entity/Subject';
import { Student } from '../entity/Student';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';

/**
 * @swagger
 * /api/register/lessonrequest:
 *   post:
 *     summary: Create a new lesson request
 *     tags: [LessonRequest]
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
 *                 description: Additional information for the lesson request
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
export class LessonRequestController {
  async create(req: Request, res: Response) {
    const { reason, preferredDates, subjectId, additionalInfo, studentId } =
      req.body;

    const lessonRequest = new LessonRequest();
    lessonRequest.reason = reason;
    lessonRequest.preferredDates = preferredDates;
    lessonRequest.additionalInfo = additionalInfo;
    lessonRequest.status = StatusName.PENDENTE;

    try {
      const [foundSubject, foundStudent] = await Promise.all([
        MysqlDataSource.getRepository(Subject).findOne({
          where: { subjectId: subjectId }
        }),
        MysqlDataSource.getRepository(Student).findOne({
          where: { id: studentId }
        })
      ]);

      if (!foundSubject) {
        return res.status(404).json({ message: 'Matéria não encontrada.' });
      }
      lessonRequest.subject = foundSubject;

      if (!foundStudent) {
        return res.status(404).json({ message: 'Aluno não encontrado.' });
      }
      lessonRequest.student = foundStudent;
      await LessonRequestRepository.createLessonRequest(lessonRequest);

      return res.status(201).json({
        message: 'Seu pedido de aula foi enviado com sucesso!',
        lessonRequest
      });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  /**
   * @swagger
   * /api/get/lessonrequest:
   *   get:
   *     summary: Retrieve all lesson requests
   *     tags: [LessonRequest]
   *     responses:
   *       '200':
   *         description: A list of lesson requests
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
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
      const lessonRequests =
        await LessonRequestRepository.getAllLessonRequests();

      const formattedLessonRequests = lessonRequests.map((request) => ({
        classId: request.ClassId,
        reason: request.reason,
        preferredDates: request.preferredDates,
        status: request.status,
        additionalInfo: request.additionalInfo,
        subjectId: request.subject?.subjectId,
        studentId: request.student?.id
      }));

      return res.status(200).json(formattedLessonRequests);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
