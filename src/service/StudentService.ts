import { EnumUserType } from '../entity/enum/EnumUserType';
import { Student } from '../entity/Student';
import { StudentRepository } from '../repository/StudentRepository';
import { UserService } from './UserService';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';

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

    const foundEducationLevel =
      await EducationLevelRepository.findEducationLevelById(educationLevelId);

    if (foundEducationLevel) {
      student.educationLevel = foundEducationLevel;
    }

    const savedStudent = await StudentRepository.saveStudent(student);
    return UserService.generateUserResponse(savedStudent, EnumUserType.STUDENT);
  }
}
