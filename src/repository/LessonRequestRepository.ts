import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';

export class LessonRequestRepository {
  static async createLessonRequest(
    lessonRequest: LessonRequest
  ): Promise<LessonRequest> {
    return await MysqlDataSource.getRepository(LessonRequest).save(
      lessonRequest
    );
  }

  static async findByPreferredDate(
    preferredDate: string,
    studentId: number
  ): Promise<LessonRequest | null> {
    return await MysqlDataSource.getRepository(LessonRequest).findOne({
      where: { preferredDates: preferredDate, student: { id: studentId } }
    });
  }

  static async getAllLessonRequests(): Promise<LessonRequest[]> {
    return await MysqlDataSource.getRepository(LessonRequest).find({
      relations: ['subject', 'student']
    });
  }

  static async getLessonRequestById(id: number): Promise<LessonRequest | null> {
    return await MysqlDataSource.getRepository(LessonRequest).findOne({
      where: { ClassId: id }
    });
  }
}
