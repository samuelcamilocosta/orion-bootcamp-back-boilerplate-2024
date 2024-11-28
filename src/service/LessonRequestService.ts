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
import { LessonRequestTutorRepository } from '../repository/LessonRequestTutorRepository';

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
        lessonRequest.lessonRequestTutors &&
        lessonRequest.lessonRequestTutors.length > 0
          ? lessonRequest.lessonRequestTutors.map((lessonRequestTutor) => ({
              tutor: TutorService.formatTutor(lessonRequestTutor.tutor),
              chosenDate: lessonRequestTutor.chosenDate
            }))
          : []
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

      await LessonRequestRepository.saveLessonRequest(lessonRequest);
      return this.formatLessonRequest(lessonRequest);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getAllLessonRequests() {
    const lessonRequests = await LessonRequestRepository.getAllLessonRequests();

    return lessonRequests;
  }

  static async getLessonRequestById(id: number) {
    const lessonRequest =
      await LessonRequestRepository.getLessonRequestById(id);
    if (!lessonRequest) {
      throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
    }

    return lessonRequest;
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

      if (lessonRequest.status === EnumStatusName.ACEITO) {
        throw new AppError(EnumErrorMessages.INVALID_PENDENTE_STATUS, 400);
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

  static async deleteLessonRequestById(classId: number) {
    try {
      const lessonRequest =
        await LessonRequestRepository.getLessonRequestById(classId);

      if (!lessonRequest) {
        throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
      }

      await LessonRequestRepository.deleteByClassId(classId);
    } catch (error) {
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
    }
  }

  static async cancelTutorLessonRequestById(classId: number, tutorId: number) {
    const lessonRequestTutor =
      await LessonRequestTutorRepository.findByLessonRequestAndTutor(
        classId,
        tutorId
      );

    if (!lessonRequestTutor) {
      throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
    }

    if (lessonRequestTutor.status !== EnumStatusName.ACEITO) {
      throw new AppError(EnumErrorMessages.INVALID_ACEITO_STATUS, 400);
    }

    await LessonRequestTutorRepository.deleteLessonRequestTutorByLessonRequestAndTutor(
      classId,
      tutorId
    );

    const tutorsRemaining =
      await LessonRequestTutorRepository.getTutorsByLessonRequestId(classId);

    if (tutorsRemaining.length === 0) {
      await this.updateStatus(classId, EnumStatusName.PENDENTE);
    }
  }

  static async updateStatus(lessonId: number, status: EnumStatusName) {
    const lessonRequest =
      await LessonRequestRepository.getLessonRequestById(lessonId);

    if (!lessonRequest) {
      throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
    }

    if (
      lessonRequest.status === EnumStatusName.ACEITO &&
      status !== EnumStatusName.PENDENTE
    ) {
      throw new AppError(EnumErrorMessages.INVALID_PENDENTE_STATUS, 400);
    }

    lessonRequest.status = status;

    const updatedLessonRequest =
      await LessonRequestRepository.saveLessonRequest(lessonRequest);

    return updatedLessonRequest;
  }
}
