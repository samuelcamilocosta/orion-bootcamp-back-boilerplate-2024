import { Tutor } from '../entity/Tutor';
import { Student } from '../entity/Student';
import { MysqlDataSource } from '../config/database';
import { EnumUserType } from '../entity/enum/EnumUserType';

export class UserRepository {
  static async findUserByEmail(
    email: string,
    userType: EnumUserType.TUTOR | EnumUserType.STUDENT
  ) {
    const repository =
      userType === EnumUserType.TUTOR
        ? MysqlDataSource.getRepository(Tutor)
        : MysqlDataSource.getRepository(Student);
    return await repository.findOne({ where: { email } });
  }
}
