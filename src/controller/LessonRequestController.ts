import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';
import { Request, Response } from 'express';
import { Subject } from '../entity/Subject';
import { Student } from '../entity/Student';

export class LessonRequestController {
  async create(req: Request, res: Response) {
    const {
      reason,
      preferredDates,
      subject,
      status,
      additionalInfo,
      studentId
    } = req.body;

    const lessonRequest = new LessonRequest();
    lessonRequest.reason = reason;
    lessonRequest.preferredDates = preferredDates;
    lessonRequest.status = status;
    lessonRequest.additionalInfo = additionalInfo;

    try {
      const foundSubjectId = await MysqlDataSource.getRepository(
        Subject
      ).findOne({
        where: { subjectId: subject }
      });

      if (foundSubjectId) {
        lessonRequest.subject = foundSubjectId;
      }
      const foundStudent = await MysqlDataSource.getRepository(Student).findOne(
        { where: { id: studentId } }
      );

      if (foundStudent) {
        lessonRequest.student = foundStudent;
      }

      await MysqlDataSource.getRepository(LessonRequest).save(lessonRequest);

      return res
        .status(201)
        .json({ message: 'Seu pedido de aula foi enviado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno no servidor' });
    }
  }
  async getAll(req: Request, res: Response) {
    try {
      const lessonRequests = await MysqlDataSource.getRepository(
        LessonRequest
      ).find({
        select: [
          'reason',
          'preferredDates',
          'status',
          'additionalInfo',
          'subject',
          'student'
        ],
        relations: ['subject', 'student']
      });

      const formattedLessonRequests = lessonRequests.map((request) => ({
        reason: request.reason,
        preferredDates: request.preferredDates,
        status: request.status,
        additionalInfo: request.additionalInfo,
        subjectId: request.subject?.subjectId,
        studentId: request.student?.id
      }));

      return res.status(200).json(formattedLessonRequests);
    } catch (error) {
      console.error('Error fetching lesson request:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  /**
   * @swagger
   * /api/get/lesson/{id}:
   *   get:
   *     summary: Retrieve a lesson request by ID
   *     tags: [lesson]
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: ID of the lesson request to retrieve
   *         schema:
   *           type: integer
   *           example: 1
   *     responses:
   *       '200':
   *         description: A lesson request object
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 reason:
   *                   type: string
   *                   example: "Reason for the lesson"
   *                 preferredDates:
   *                   type: array
   *                   items:
   *                     type: string
   *                     format: date
   *                   example: ["2023-10-01", "2023-10-02"]
   *                 status:
   *                   type: string
   *                   example: "Pending"
   *                 additionalInfo:
   *                   type: string
   *                   example: "Any additional information"
   *                 subjectId:
   *                   type: integer
   *                   example: 1
   *                 studentId:
   *                   type: integer
   *                   example: 1
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
      const lesson = await MysqlDataSource.getRepository(LessonRequest).findOne(
        {
          where: { ClassId: Number(id) }
        }
      );

      if (!lesson) {
        return res.status(404).json({ message: 'Aula não encontrada.' });
      }

      return res.status(200).json(lesson);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
