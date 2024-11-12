import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';
import { MysqlDataSource } from '../config/database';
import { EnumUserType } from '../entity/enum/EnumUserType';

export class UserRepository {
  static async findUserByUsername(username: string) {
    const tutorRepository = MysqlDataSource.getRepository(Tutor);
    const studentRepository = MysqlDataSource.getRepository(Student);

    const existingTutor = await tutorRepository.findOne({
      where: { username: username }
    });

    const existingStudent = await studentRepository.findOne({
      where: { username: username }
    });

    return existingStudent || existingTutor;
  }

  static async findUserByEmail(
    email: string,
    userType: EnumUserType.TUTOR | EnumUserType.STUDENT
  ) {
    const repository =
      userType === EnumUserType.TUTOR
        ? MysqlDataSource.getRepository(Tutor)
        : MysqlDataSource.getRepository(Student);
    return await repository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'username',
        'fullName',
        'password',
        'lessonRequests'
      ],
      relations: ['lessonRequests']
    });
  }
}
