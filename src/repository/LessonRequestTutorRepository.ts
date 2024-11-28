import { MysqlDataSource } from '../config/database';
import { LessonRequestTutor } from '../entity/LessonRequestTutor';
import { LessonRequest } from '../entity/LessonRequest';
import { Tutor } from '../entity/Tutor';
import { EnumStatusName } from '../enum/EnumStatusName';

export class LessonRequestTutorRepository {
  static async createLessonRequestTutor(
    lessonRequest: LessonRequest,
    tutor: Tutor,
    chosenDate: string,
    lessonRequestStatus: EnumStatusName
  ): Promise<LessonRequestTutor> {
    const lessonRequestTutor = new LessonRequestTutor();
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);
    lessonRequestTutor.lessonRequest = lessonRequest;
    lessonRequestTutor.tutor = tutor;
    lessonRequestTutor.chosenDate = chosenDate;
    lessonRequestTutor.status = lessonRequestStatus;
    return repository.save(lessonRequestTutor);
  }

  static async findLessonRequestTutorByLessonRequestId(
    lessonRequestId: number
  ): Promise<LessonRequestTutor[]> {
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);
    return repository
      .createQueryBuilder('lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('lessonRequestTutor.lessonRequest', 'lessonRequest')
      .where('lessonRequestTutor.lessonRequestId = :lessonRequestId', {
        lessonRequestId
      })
      .getMany();
  }

  static async findLessonRequestTutorByTutorId(
    tutorId: number
  ): Promise<LessonRequestTutor[]> {
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);
    return repository
      .createQueryBuilder('lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.lessonRequest', 'lessonRequest')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .where('lessonRequestTutor.tutorId = :tutorId', { tutorId })
      .getMany();
  }

  static async updateStatus(
    lessonRequestTutorId: number,
    status: EnumStatusName
  ): Promise<void> {
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);
    await repository
      .createQueryBuilder()
      .update(LessonRequestTutor)
      .set({ status })
      .where('id = :id', { id: lessonRequestTutorId })
      .execute();
  }

  static async getTutorsByLessonRequestId(
    lessonRequestId: number
  ): Promise<Tutor[]> {
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);
    const result = await repository
      .createQueryBuilder('lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .where('lessonRequestTutor.lessonRequestId = :lessonRequestId', {
        lessonRequestId
      })
      .getMany();

    return result.map((entry) => entry.tutor);
  }

  static async getLessonRequestsByTutorId(
    tutorId: number
  ): Promise<LessonRequest[]> {
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);
    const result = await repository
      .createQueryBuilder('lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.lessonRequest', 'lessonRequest')
      .where('lessonRequestTutor.tutorId = :tutorId', { tutorId })
      .getMany();

    return result.map((entry) => entry.lessonRequest);
  }

  static async getChosenDatesByLessonRequestId(
    lessonRequestId: number
  ): Promise<string[]> {
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);
    const result = await repository
      .createQueryBuilder('lessonRequestTutor')
      .where('lessonRequestTutor.lessonRequestId = :lessonRequestId', {
        lessonRequestId
      })
      .getMany();

    return result.map((entry) => entry.chosenDate).flat();
  }

  static async findByLessonRequestAndTutor(
    lessonRequestId: number,
    tutorId: number
  ): Promise<LessonRequestTutor | null> {
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);

    return repository
      .createQueryBuilder('lessonRequestTutor')
      .where('lessonRequestTutor.lessonRequestId = :lessonRequestId', {
        lessonRequestId
      })
      .andWhere('lessonRequestTutor.tutorId = :tutorId', { tutorId })
      .getOne();
  }

  static async deleteLessonRequestTutorByLessonRequestAndTutor(
    lessonRequestId: number,
    tutorId: number
  ): Promise<void> {
    const repository = MysqlDataSource.getRepository(LessonRequestTutor);
    await repository
      .createQueryBuilder()
      .delete()
      .from(LessonRequestTutor)
      .where('lessonRequestId = :lessonRequestId', { lessonRequestId })
      .andWhere('tutorId = :tutorId', { tutorId })
      .execute();
  }
}
