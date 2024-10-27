import { Subject } from '../entity/Subject';
import { MysqlDataSource } from '../config/database';
import { Request, Response } from 'express';

export class SubjectController {
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
