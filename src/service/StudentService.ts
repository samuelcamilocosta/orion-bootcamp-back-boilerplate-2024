import { MysqlDataSource } from '../config/database';
import { EnumUserType } from '../entity/enum/EnumUserType';
import { Student } from '../entity/Student';
import { StudentRepository } from '../repository/StudentRepository';
import { UserService } from './UserService';
import { EducationLevel } from '../entity/EducationLevel';

export class StudentService extends UserService {
  static async createStudent(studentData) {
    const { fullName, username, birthDate, email, educationLevelId, password } =
      studentData;
    const { hashedPassword, salt } = password;

    const student = new Student();
    student.fullName = fullName;
    student.username = username;
    student.birthDate = birthDate;
    student.password = hashedPassword;
    student.email = email;
    student.salt = salt;

    const foundEducationLevel = await MysqlDataSource.getRepository(
      EducationLevel
    ).findOne({ where: { educationId: educationLevelId } });

    if (foundEducationLevel) {
      student.educationLevel = foundEducationLevel;
    }

    const savedStudent = await StudentRepository.saveStudent(student);
    return UserService.generateUserResponse(savedStudent, EnumUserType.STUDENT);
  }
}
