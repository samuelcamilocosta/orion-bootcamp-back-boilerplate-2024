import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';

export class LessonRequestRepository {
  private static relations = ['subject', 'student', 'tutors'];

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

  static async getAllLessonRequests(): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequest);
    return await repository.find({
      relations: this.relations
    });
  }

  static async getLessonRequestById(id: number): Promise<LessonRequest | null> {
    return await MysqlDataSource.getRepository(LessonRequest)
      .createQueryBuilder('lessonRequest')
      .leftJoinAndSelect('lessonRequest.tutors', 'tutor')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .where('lessonRequest.ClassId = :id', { id })
      .getOne();
  }
}
