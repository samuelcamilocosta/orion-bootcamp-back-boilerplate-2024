import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { UserRepository } from './UserRepository';

export class TutorRepository extends UserRepository {
  static async saveTutor(tutor: Tutor): Promise<Tutor> {
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

  static async findTutorById(id: number) {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository.findOne({
      where: { id },
      select: [
        'id',
        'cpf',
        'username',
        'email',
        'fullName',
        'educationLevels',
        'photoUrl',
        'lessonRequests',
        'subjects'
      ],
      relations: ['educationLevels', 'lessonRequests', 'subjects']
    });
  }
}
