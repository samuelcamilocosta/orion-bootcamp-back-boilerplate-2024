import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { UserRepository } from './UserRepository';

export class TutorRepository extends UserRepository {
  static async createTutor(tutor: Tutor): Promise<Tutor> {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository.save(tutor);
  }

  static async findAllTutors() {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository.find({
      select: [
        'id',
        'cpf',
        'username',
        'email',
        'fullName',
        'photoUrl',
        'educationLevels',
        'lessonRequests',
        'subjects'
      ],
      relations: ['educationLevels', 'lessonRequests', 'subjects']
    });
  }

  static async update(tutor: Tutor): Promise<Tutor> {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository.save(tutor);
  }
}
