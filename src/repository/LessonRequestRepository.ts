import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';

export class LessonRequestRepository {
  static async saveLessonRequest(lessonRequest: LessonRequest): Promise<LessonRequest> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.save(lessonRequest);
  }

  static async findByPreferredDate(preferredDate: string, studentId: number): Promise<LessonRequest | null> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.findOne({
      where: { preferredDates: preferredDate, student: { id: studentId } }
    });
  }

  static async getAllLessonRequests(): Promise<LessonRequest[] | null> {
    const repository = MysqlDataSource.getRepository(LessonRequest);

    return repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .getMany();
  }

  static async getLessonRequestById(id: number): Promise<LessonRequest | null> {
    return MysqlDataSource.getRepository(LessonRequest)
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .where('lessonRequest.ClassId = :id', { id })
      .getOne();
  }

  static async findByClassId(ClassId: number): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return repository.find({ where: { ClassId } });
  }

  static async deleteByClassId(ClassId: number): Promise<void> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    await repository.delete({ ClassId });
  }
}
