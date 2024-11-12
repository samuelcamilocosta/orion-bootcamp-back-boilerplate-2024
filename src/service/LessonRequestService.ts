import { LessonRequest } from '../entity/LessonRequest';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { EnumStatusName } from '../entity/enum/EnumStatusName';
import { SubjectRepository } from '../repository/SubjectRepository';
import { StudentRepository } from '../repository/StudentRepository';

export class LessonRequestService {
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
        throw new Error('Matéria não encontrada.');
      }
      if (!foundStudent) {
        throw new Error('Aluno não encontrado.');
      }

      lessonRequest.subject = foundSubject;
      lessonRequest.student = foundStudent;

      return await LessonRequestRepository.saveLessonRequest(lessonRequest);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor.');
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
      throw new Error('Erro interno do servidor.');
    }
  }

  static async getLessonRequestById(id: number) {
    const lesson = await LessonRequestRepository.getLessonRequestById(
      Number(id)
    );

    if (!lesson) {
      throw new Error('Aula não encontrada.');
    }
    return lesson;
  }
}
