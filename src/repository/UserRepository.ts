import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';
import { MysqlDataSource } from '../config/database';

export class UserRepository {
  static async findUserByEmail(email: string) {
    const tutorRepository = MysqlDataSource.getRepository(Tutor);
    const studentRepository = MysqlDataSource.getRepository(Student);
    const user =
      (await tutorRepository.findOne({ where: { email } })) ||
      (await studentRepository.findOne({ where: { email } }));
    return user;
  }
}
