import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';
import { validationResult } from 'express-validator';
import { Student } from '../entity/Student';

export class StudentController {
  async create(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, username, birthDate, email, educationLevel, password } =
      req.body;

    // const { hashedPassword, salt } = password;
    const salt = 'salt-exemple';
    const student = new Student();
    student.fullName = fullName;
    student.username = username;
    student.birthDate = birthDate;
    student.password = password;
    student.email = email;
    student.salt = salt;

    try {
      const foundEducationLevels = await MysqlDataSource.getRepository(
        EducationLevel
      ).findOne({
        where: { educationId: educationLevel }
      });
      console.log('Found education levels:', foundEducationLevels);

      if (foundEducationLevels) {
        student.educationLevel = foundEducationLevels;
      }

      await MysqlDataSource.getRepository(Student).save(student);

      return res.status(201).json(student);
    } catch (error) {
      console.error('Error saving student:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const student = await MysqlDataSource.getRepository(Student).find();
      return res.status(200).json(student);
    } catch (error) {
      console.error('Erro fetching students:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
