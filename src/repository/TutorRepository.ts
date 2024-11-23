import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { UserRepository } from './UserRepository';

export class TutorRepository extends UserRepository {
  static async saveTutor(tutor: Tutor): Promise<Tutor> {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository.save(tutor);
  }

  static async findTutorByCpf(cpf: string) {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository.findOne({ where: { cpf } });
  }

  static async findAllTutors() {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository
      .createQueryBuilder('mainTutor')
      .leftJoinAndSelect('mainTutor.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.lessonRequest', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .leftJoinAndSelect('mainTutor.subjects', 'subjects')
      .getMany();
  }

  static async findTutorById(tutorId: number) {
    const repository = MysqlDataSource.getRepository(Tutor);

    const tutor = await repository
      .createQueryBuilder('mainTutor')
      .leftJoinAndSelect('mainTutor.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.lessonRequest', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .leftJoinAndSelect('mainTutor.subjects', 'subjects')
      .where('mainTutor.id = :id', { id: tutorId })
      .getOne();

    return tutor;
  }
}
