import { MysqlDataSource } from '../config/database';
import { Student } from '../entity/Student';
import { UserRepository } from './UserRepository';
import { EnumStatusName } from '../enum/EnumStatusName';

export class StudentRepository extends UserRepository {
  private static relations = ['educationLevel', 'lessonRequests'];
  private static selectFields = [
    'id',
    'username',
    'fullName',
    'birthDate',
    'fullName',
    'educationLevel',
    'lessonRequests'
  ];

  static async saveStudent(student: Student): Promise<Student> {
    const repository = MysqlDataSource.getRepository(Student);
    return await repository.save(student);
  }

  static async findAllStudents() {
    const repository = MysqlDataSource.getRepository(Student);
    return await repository.find({
      select: Object.fromEntries(
        this.selectFields.map((field) => [field, true])
      ),
      relations: this.relations
    });
  }

  static async findStudentById(id: number) {
    const repository = MysqlDataSource.getRepository(Student);
    return await repository.findOne({
      where: { id },
      select: Object.fromEntries(
        this.selectFields.map((field) => [field, true])
      ),
      relations: this.relations
    });
  }

  static async findLessonsByStudentIdAndStatus(id: number, status: EnumStatusName) {
    const repository = MysqlDataSource.getRepository(Student);

    const rawResults = await repository
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.lessonRequests', 'lessonRequest')
      .leftJoinAndSelect('lessonRequest.subject', 'subject')
      .leftJoinAndSelect('lessonRequest.tutors', 'tutor')
      .where('student.id = :id', { id })
      .andWhere('lessonRequest.status = :status', { status })
      .select([
        'lessonRequest.ClassId as classId',
        'lessonRequest.reason as reason',
        'lessonRequest.preferredDates as preferredDates',
        'lessonRequest.status as status',
        'lessonRequest.additionalInfo as additionalInfo',
        'lessonRequest.subject.subjectId as subjectId',
        'lessonRequest.student.id as studentId',
        'tutor.id as tutorId'
      ])
      .getRawMany();

    return rawResults.map((result) => ({
      classId: result.classId,
      reason: result.reason ? [result.reason] : [],
      preferredDates: result.preferredDates ? [result.preferredDates] : [],
      status: result.status,
      additionalInfo: result.additionalInfo,
      subjectId: result.subjectId,
      studentId: result.studentId,
      tutorId: result.tutorId
    }));
  }
}
