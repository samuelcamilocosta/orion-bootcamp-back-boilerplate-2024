import { MysqlDataSource } from '../config/database';
import { Student } from '../entity/Student';
import { UserRepository } from './UserRepository';
import { EnumStatusName } from '../enum/EnumStatusName';

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
      .leftJoinAndSelect('lessonRequest.tutors', 'lessonTutors')
      .orderBy('student.id', 'ASC')
      .addOrderBy('lessonRequest.ClassId', 'ASC')
      .getMany();

    return student;
  }

  static async findStudentById(id: number) {
    const repository = MysqlDataSource.getRepository(Student);

    const student = await repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.educationLevel', 'educationLevel')
      .leftJoinAndSelect('student.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.tutors', 'tutors')
      .where('student.id = :id', { id })
      .getOne();

    return student;
  }

  static async findStudentLessonsByStatus(
    studentId: { id: string },
    status: EnumStatusName
  ) {
    const repository = MysqlDataSource.getRepository(Student);

    const numericStudentId = Number(studentId.id);
    const results = await repository
      .createQueryBuilder('mainStudent')
      .leftJoinAndSelect('mainStudent.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.tutors', 'tutor')
      .leftJoinAndSelect('lessonRequest.student', 'student')
      .where('mainStudent.id = :id', { id: numericStudentId })
      .andWhere('lessonRequest.status = :status', { status })
      .getMany();

    return results
      .map((student) => {
        return student.lessonRequests.map((lessonRequest) => ({
          ClassId: lessonRequest.ClassId,
          reason: lessonRequest.reason ? lessonRequest.reason : [],
          preferredDates: lessonRequest.preferredDates
            ? lessonRequest.preferredDates
            : [],
          status: lessonRequest.status,
          additionalInfo: lessonRequest.additionalInfo,
          subject: lessonRequest.subject,
          student: lessonRequest.student,
          tutors: lessonRequest.tutors
        }));
      })
      .flat();
  }
}
