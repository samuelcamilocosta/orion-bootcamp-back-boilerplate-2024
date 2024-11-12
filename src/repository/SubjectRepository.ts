import { MysqlDataSource } from '../config/database';
import { Subject } from '../entity/Subject';

export class SubjectRepository {
  static async saveSubject(subject: Subject): Promise<Subject> {
    const repository = MysqlDataSource.getRepository(Subject);
    return await repository.save(subject);
  }

  static async findSubjectById(subjectId: number): Promise<Subject | null> {
    const repository = MysqlDataSource.getRepository(Subject);
    return await repository.findOne({ where: { subjectId } });
  }

  static async findAllSubjects() {
    const repository = MysqlDataSource.getRepository(Subject);
    return await repository.find({
      select: ['subjectId', 'subjectName']
    });
  }
}
