import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { UserRepository } from './UserRepository';

export class TutorRepository extends UserRepository {
  private static relations = ['educationLevels', 'lessonRequests', 'subjects'];
  private static selectFields = [
    'id',
    'username',
    'fullName',
    'photoUrl',
    'birthDate',
    'expertise',
    'projectReason',
    'educationLevels',
    'lessonRequests',
    'subjects'
  ];

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
    return await repository.find({
      select: Object.fromEntries(
        this.selectFields.map((field) => [field, true])
      ),
      relations: this.relations
    });
  }

  static async findTutorById(id: number) {
    const repository = MysqlDataSource.getRepository(Tutor);
    return await repository.findOne({
      where: { id },
      select: Object.fromEntries(
        this.selectFields.map((field) => [field, true])
      ),
      relations: this.relations
    });
  }
}
