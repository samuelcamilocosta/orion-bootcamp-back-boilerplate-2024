import { Subject } from '../entity/Subject';
import { SubjectRepository } from '../repository/SubjectRepository';

export class SubjectService {
  static async createSubject(subjectName: string) {
    if (!subjectName) {
      throw new Error('Nome da matéria é obrigatório.');
    }

    const subject = new Subject();
    subject.subjectName = subjectName;
    return await SubjectRepository.saveSubject(subject);
  }
}
