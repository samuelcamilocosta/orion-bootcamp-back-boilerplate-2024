import { Subject } from '../entity/Subject';
import { SubjectRepository } from '../repository/SubjectRepository';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../error/enum/EnumErrorMessages';

export class SubjectService {
  static async createSubject(subjectName: string) {
    if (!subjectName) {
      throw new AppError(EnumErrorMessages.INVALID_CHAR_LENGTH, 400);
    }

    const subject = new Subject();
    subject.subjectName = subjectName;
    return await SubjectRepository.saveSubject(subject);
  }

  static async getAllSubjects() {
    try {
      return await SubjectRepository.findAllSubjects();
    } catch (error) {
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
    }
  }
}
