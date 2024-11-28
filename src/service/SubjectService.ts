import { Subject } from '../entity/Subject';
import { SubjectRepository } from '../repository/SubjectRepository';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { handleError } from '../utils/ErrorHandler';

export class SubjectService {
  static async createSubject(subjectName: string) {
    try {
      if (!subjectName) {
        throw new AppError(EnumErrorMessages.INVALID_CHAR_LENGTH, 400);
      }

      const subject = new Subject();
      subject.subjectName = subjectName;
      return SubjectRepository.saveSubject(subject);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getAllSubjects() {
    try {
      return SubjectRepository.findAllSubjects();
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }
}
