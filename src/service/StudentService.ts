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

    if (!foundEducationLevel) {
      throw new Error('Nível de ensino não encontrado.');
    }

    const savedStudent = await StudentRepository.saveStudent(student);
    return UserService.generateUserResponse(savedStudent, EnumUserType.STUDENT);
  }

  static async getStudentById(id: number) {
    const student = await StudentRepository.findStudentById(id);

    if (!student) {
      throw new Error('Aluno não encontrado.');
    }
    return student;
  }

  static async getAllStudents() {
    const students = await StudentRepository.findAllStudents();
    if (!students) {
      throw new Error('Nenhum aluno encontrado.');
    }
    return students;
  }
}
