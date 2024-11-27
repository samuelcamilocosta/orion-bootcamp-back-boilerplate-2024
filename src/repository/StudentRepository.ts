import { MysqlDataSource } from '../config/database';
import { Student } from '../entity/Student';
import { UserRepository } from './UserRepository';
import { EnumStatusName } from '../enum/EnumStatusName';
import { LessonRequest } from '../entity/LessonRequest';
import { LessonRequestTutorRepository } from './LessonRequestTutorRepository';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';

export class StudentRepository extends UserRepository {
  static async saveStudent(student: Student): Promise<Student> {
    const repository = MysqlDataSource.getRepository(Student);
    return await repository.save(student);
  }

  static async findAllStudents() {
    const repository = MysqlDataSource.getRepository(Student);

    const student = await repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('student.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .orderBy('student.id', 'ASC')
      .addOrderBy('lessonRequest.ClassId', 'ASC')
      .getMany();

    return student;
  }

  static async findStudentById(id: number): Promise<Student> {
    const repository = MysqlDataSource.getRepository(Student);
    const student = await repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('student.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .where('student.id = :id', { id })
      .getOne();

    if (!student) {
      console.error(`Student with ID ${id} not found`);
      throw new AppError(EnumErrorMessages.STUDENT_NOT_FOUND, 404);
    }

    return student;
  }

  static async findStudentLessonsByStatus(studentId: number, status: EnumStatusName): Promise<Student[]> {
    const repository = MysqlDataSource.getRepository(Student);

    const results = await repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('student.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.lessonRequestTutors', 'lessonRequestTutor')
      .leftJoinAndSelect('lessonRequestTutor.tutor', 'tutor')
      .leftJoinAndSelect('tutor.subjects', 'subjects')
      .where('student.id = :id', { id: studentId })
      .andWhere('lessonRequest.status = :status', { status })
      .getMany();

    return results;
  }
}
