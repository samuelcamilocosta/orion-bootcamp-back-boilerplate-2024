import { MysqlDataSource } from '../config/database';
import { Student } from '../entity/Student';
import { UserRepository } from './UserRepository';

export class StudentRepository extends UserRepository {
  static async saveStudent(student: Student): Promise<Student> {
    const repository = MysqlDataSource.getRepository(Student);
    return await repository.save(student);
  }

  static async findAllStudents() {
    const repository = MysqlDataSource.getRepository(Student);
    return await repository.find({
      select: [
        'id',
        'username',
        'email',
        'fullName',
        'educationLevel',
        'lessonRequests'
      ],
      relations: ['educationLevel', 'lessonRequests']
    });
  }

  static async findStudentById(id: number) {
    const repository = MysqlDataSource.getRepository(Student);
    return await repository.findOne({
      where: { id },
      select: [
        'id',
        'username',
        'email',
        'fullName',
        'educationLevel',
        'lessonRequests'
      ],
      relations: ['educationLevel', 'lessonRequests']
    });
  }
}
