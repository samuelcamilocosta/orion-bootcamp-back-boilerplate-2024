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

    const { hashedPassword, salt } = password;

    const student = new Student();
    student.fullName = fullName;
    student.username = username;
    student.birthDate = birthDate;
    student.password = hashedPassword;
    student.email = email;
    student.salt = salt;

    try {
      const foundEducationLevels = await MysqlDataSource.getRepository(
        EducationLevel
      ).findOne({
        where: { educationId: educationLevel }
      });

      if (foundEducationLevels) {
        student.educationLevel = foundEducationLevels;
      }

      await MysqlDataSource.getRepository(Student).save(student);
      return res.status(201).json({
        email: student.email,
        password: student.password
      });
    } catch (error) {
      console.error('Error saving student:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const student = await MysqlDataSource.getRepository(Student).find({
        select: ['username', 'email', 'fullName']
      });
      return res.status(200).json(student);
    } catch (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const student = await MysqlDataSource.getRepository(Student).findOne({
        where: { id: Number(id) },
        relations: ['educationLevel']
      });

      if (!student) {
        res.status(404).json({ message: 'Estudante não encontrado.' });
      }

      return res.status(200).json(student);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
