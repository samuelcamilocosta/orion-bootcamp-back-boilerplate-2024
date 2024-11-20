import { LessonRequest } from '../entity/LessonRequest';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { EnumStatusName } from '../enum/EnumStatusName';
import { SubjectRepository } from '../repository/SubjectRepository';
import { StudentRepository } from '../repository/StudentRepository';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { StudentService } from './StudentService';
import { TutorService } from './TutorService';

export class LessonRequestService {
  static formatLessonRequest(lessonRequest: LessonRequest) {
    return {
      ClassId: lessonRequest.ClassId,
      reason: lessonRequest.reason,
      preferredDates: lessonRequest.preferredDates,
      status: lessonRequest.status,
      additionalInfo: lessonRequest.additionalInfo,
      subject: lessonRequest.subject,
      student: lessonRequest.student
        ? StudentService.formatStudent(lessonRequest.student)
        : null,
      tutor: lessonRequest.tutor
        ? TutorService.formatTutor(lessonRequest.tutor)
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
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
    }
  }

  static async getAllLessonRequests() {
    try {
      const lessonRequests =
        await LessonRequestRepository.getAllLessonRequests();

      const formattedLessonRequests = lessonRequests.map((request) => ({
        classId: request.ClassId,
        reason: request.reason,
        preferredDates: request.preferredDates,
        status: request.status,
        additionalInfo: request.additionalInfo,
        subjectId: request.subject?.subjectId,
        studentId: request.student?.id
      }));

      return formattedLessonRequests;
    } catch (error) {
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
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
      throw new AppError(EnumErrorMessages.INTERNAL_SERVER, 500);
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
}
