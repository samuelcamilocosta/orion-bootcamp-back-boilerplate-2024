import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';

export class LessonRequestRepository {
  private static relations = [
    'lessonRequestTutors',
    'lessonRequestTutors.tutor',
    'subject',
    'student'
  ];

  static async saveLessonRequest(
    lessonRequest: LessonRequest
  ): Promise<LessonRequest> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return await repository.save(lessonRequest);
  }

  static async findByPreferredDate(
    preferredDate: string,
    studentId: number
  ): Promise<LessonRequest | null> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return await repository.findOne({
      where: { preferredDates: preferredDate, student: { id: studentId } }
    });
  }

  static async getAllLessonRequests() {
    const repository = MysqlDataSource.getRepository(LessonRequest);

    return await repository
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect(
        'lessonRequest.lessonRequestTutors',
        'lessonRequestTutor'
      )
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .getMany();
  }

  static async getLessonRequestById(id: number): Promise<LessonRequest | null> {
    return await MysqlDataSource.getRepository(LessonRequest)
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect(
        'lessonRequest.lessonRequestTutors',
        'lessonRequestTutor'
      )
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .where('lessonRequest.ClassId = :id', { id })
      .getOne();
  }

  static async findByClassId(ClassId: number): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return await repository.find({ where: { ClassId } });
  }

  static async deleteByClassId(ClassId: number): Promise<void> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    await repository.delete({ ClassId });
  }
}
