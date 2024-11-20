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
      .createQueryBuilder('tutor')
      .leftJoinAndSelect('tutor.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.tutors', 'tutors')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .getMany();
  }

  static async findTutorById(id: number) {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository
      .createQueryBuilder('tutor')
      .leftJoinAndSelect('tutor.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .where('tutor.id = :id', { id })
      .getOne();
  }
}
