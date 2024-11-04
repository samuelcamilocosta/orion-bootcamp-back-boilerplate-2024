import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';
import { Request, Response } from 'express';
import { StatusName } from '../entity/enum/StatusName';
import { Subject } from '../entity/Subject';
import { Student } from '../entity/Student';

export class LessonRequestController {
  async create(req: Request, res: Response) {
    const {
      reason,
      preferredDates,
      subjectId,
      additionalInfo,
      studentId
    } = req.body;

    const lessonRequest = new LessonRequest();
    lessonRequest.reason = reason;
    lessonRequest.preferredDates = preferredDates;
    lessonRequest.additionalInfo = additionalInfo;
    lessonRequest.status = StatusName.PENDENTE;

    try {
      const [foundSubject, foundStudent] = await Promise.all([
        MysqlDataSource.getRepository(Subject).findOne({ where: { subjectId: subjectId } }),
        MysqlDataSource.getRepository(Student).findOne({ where: { id: studentId } })
      ]);

      if (!foundSubject) {
        return res.status(404).json({ message: 'Matéria não encontrada.' });
      }
      lessonRequest.subject = foundSubject;

      if (!foundStudent) {
        return res.status(404).json({ message: 'Aluno não encontrado.' });
      }
      lessonRequest.student = foundStudent;
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
}
