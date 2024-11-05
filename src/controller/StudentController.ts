import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';
import { Student } from '../entity/Student';

export class StudentController {
  async create(req: Request, res: Response) {
    const { fullName, username, birthDate, password, email, educationLevelId } =
      req.body;

    const { hashedPassword, salt } = password;

    const student = new Student();
    student.fullName = fullName;
    student.username = username;
    student.birthDate = birthDate;
    student.password = hashedPassword;
    student.email = email;
    student.salt = salt;

    try {
      const foundEducationLevel = await MysqlDataSource.getRepository(
        EducationLevel
      ).findOne({
        where: { educationId: educationLevelId }
      });

      if (foundEducationLevel) {
        student.educationLevel = foundEducationLevel;
      }

      await MysqlDataSource.getRepository(Student).save(student);

      return res.status(201).json({
        fullName: student.fullName,
        username: student.username,
        birthDate: student.birthDate,
        email: student.email,
        educationLevel: student.educationLevel,
        id: student.id
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const student = await MysqlDataSource.getRepository(Student).find({
        select: ['id', 'username', 'email', 'fullName']
      });
      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
