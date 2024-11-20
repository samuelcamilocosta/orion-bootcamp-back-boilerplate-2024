import { LessonRequest } from '../entity/LessonRequest';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { SubjectRepository } from '../repository/SubjectRepository';
import { StudentRepository } from '../repository/StudentRepository';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { EnumReasonName } from '../enum/EnumReasonName';
import { EnumStatusName } from '../enum/EnumStatusName';
import { StudentService } from './StudentService';
import { TutorService } from './TutorService';
import { handleError } from '../utils/ErrorHandler';

export class LessonRequestService {
  static formatLessonRequest(lessonRequest: LessonRequest) {
    return {
      ClassId: lessonRequest.ClassId,
      reason: Array.isArray(lessonRequest.reason)
        ? lessonRequest.reason
        : [lessonRequest.reason],
      preferredDates: lessonRequest.preferredDates
        ? lessonRequest.preferredDates
        : [],
      status: lessonRequest.status,
      additionalInfo: lessonRequest.additionalInfo,
      subject: lessonRequest.subject,
      student: lessonRequest.student
        ? StudentService.formatStudent(lessonRequest.student)
        : null,
      tutors:
        lessonRequest.tutors && lessonRequest.tutors.length > 0
          ? lessonRequest.tutors.map((tutor) => TutorService.formatTutor(tutor))
          : null
    };
  }

  static async createLessonRequest(lessonRequestData) {
    try {
      const { reason, preferredDates, subjectId, additionalInfo, studentId } =
        lessonRequestData;

      const lessonRequest = new LessonRequest();
      lessonRequest.reason = reason;
      lessonRequest.preferredDates = preferredDates;
      lessonRequest.additionalInfo = additionalInfo;
      lessonRequest.status = EnumStatusName.PENDENTE;

      const [foundSubject, foundStudent] = await Promise.all([
        SubjectRepository.findSubjectById(subjectId),
        StudentRepository.findStudentById(studentId)
      ]);

      if (!foundSubject) {
        throw new AppError(EnumErrorMessages.SUBJECT_NOT_FOUND, 404);
      }
      if (!foundStudent) {
        throw new AppError(EnumErrorMessages.STUDENT_NOT_FOUND, 404);
      }

      lessonRequest.subject = foundSubject;
      lessonRequest.student = foundStudent;

      return await LessonRequestRepository.saveLessonRequest(lessonRequest);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getAllLessonRequests() {
    try {
      const lessonRequests =
        await LessonRequestRepository.getAllLessonRequests();

      return lessonRequests.map(this.formatLessonRequest);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getLessonRequestById(id: number) {
    try {
      const lessonRequest = await LessonRequestRepository.getLessonRequestById(
        Number(id)
      );

      if (!lessonRequest) {
        throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
      }
      return LessonRequestService.formatLessonRequest(lessonRequest);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async updateLessonRequest(
    lessonId: number,
    subjectId: number,
    reason: EnumReasonName[],
    additionalInfo: string,
    preferredDates: string[]
  ) {
    try {
      const lessonRequest =
        await LessonRequestRepository.getLessonRequestById(lessonId);

      if (!lessonRequest) {
        throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
      }

      if (
        !reason.every((reason) =>
          Object.values(EnumReasonName).includes(reason)
        )
      ) {
        const validReasons = Object.values(EnumReasonName).join(', ');
        throw new AppError(
          EnumErrorMessages.REASON_INVALID.replace(
            '${validReasons}',
            validReasons
          ),
          400
        );
      }

      const foundSubject = await SubjectRepository.findSubjectById(subjectId);

      if (!foundSubject) {
        throw new AppError(EnumErrorMessages.SUBJECT_NOT_FOUND, 404);
      }

      lessonRequest.reason = reason;
      lessonRequest.additionalInfo = additionalInfo;
      lessonRequest.preferredDates = preferredDates;
      lessonRequest.subject = foundSubject;

      const updatedLesson =
        await LessonRequestRepository.saveLessonRequest(lessonRequest);

      return updatedLesson;
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }
}
