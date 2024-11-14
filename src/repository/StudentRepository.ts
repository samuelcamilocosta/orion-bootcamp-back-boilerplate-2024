import { MysqlDataSource } from '../config/database';
import { Student } from '../entity/Student';
import { UserRepository } from './UserRepository';

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
}
