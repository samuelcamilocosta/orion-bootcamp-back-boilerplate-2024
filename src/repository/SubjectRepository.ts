import { MysqlDataSource } from '../config/database';
import { Subject } from '../entity/Subject';
import { In } from 'typeorm';

export class SubjectRepository {
  static async saveSubject(subject: Subject): Promise<Subject> {
    const repository = MysqlDataSource.getRepository(Subject);
    return await repository.save(subject);
  }

  static async findSubjectById(subjectId: number): Promise<Subject | null> {
    const repository = MysqlDataSource.getRepository(Subject);
    return await repository.findOne({ where: { subjectId } });
  }

  static async findSubjectByIds(subjectIds: number[]): Promise<Subject[]> {
    const repository = MysqlDataSource.getRepository(Subject);
    return await repository.find({ where: { subjectId: In(subjectIds) } });
  }

  static async findAllSubjects() {
    const repository = MysqlDataSource.getRepository(Subject);
    return await repository.find();
  }
}
