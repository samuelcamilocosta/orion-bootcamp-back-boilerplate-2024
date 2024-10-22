import { body } from 'express-validator';
import * as bcrypt from 'bcrypt';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';
import { Student } from '../entity/Student';
import { Tutor } from '../entity/Tutor';
import { In } from 'typeorm';

const birthDateRegex =
  /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2]|[0-9])\/\d{4}$/;

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%¨&*])[A-Za-z\d!@#$%¨&*]{6,}$/;

export class CommonValidations {
  protected fullName() {
    return body('fullName')
      .trim()
      .isString()
      .withMessage('Nome completo inválido.')
      .notEmpty()
      .withMessage('Nome completo é obrigatório.');
  }

  protected username() {
    return body('username')
      .trim()
      .isString()
      .withMessage('Nome de usuário inválido.')
      .notEmpty()
      .withMessage('Nome de usuário é obrigatório.');
  }

  protected birthDate() {
    return body('birthDate')
      .trim()
      .isString()
      .withMessage('Data de nascimento inválida.')
      .notEmpty()
      .withMessage('Data de nascimento é obrigatória.')
      .custom((value: string): boolean => {
        if (!birthDateRegex.test(value)) {
          throw new Error(
            'Data de nascimento deve estar no formato DD/MM/YYYY.'
          );
        }

        const [day, month, year] = value.split('/').map(Number);
        const dateErrorMessage =
          'Data de nascimento incorreta, verifique a data inserida.';

        if (month === 2) {
          const isLeapYear =
            (year % 4 === 0 && year % 100 === 0) || year % 400 === 0
              ? true
              : false;
          if (day > 29 || (day === 29 && !isLeapYear)) {
            throw new Error(dateErrorMessage);
          }
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
          if (day > 30) {
            throw new Error(dateErrorMessage);
          }
        } else if (day > 31) {
          throw new Error(dateErrorMessage);
        }

        const currentDate = new Date();
        if (
          day > currentDate.getDay() &&
          month > currentDate.getMonth() + 1 &&
          year > currentDate.getFullYear()
        ) {
          throw new Error(dateErrorMessage);
        }

        return true;
      })
      .customSanitizer((value: string): Date => {
        const [day, month, year] = value.split('/');
        const newBirthDate = new Date(`${year}-${month}-${day}`);

        return newBirthDate;
      });
  }

  protected confirmPassword() {
    return body('confirmPassword')
      .trim()
      .isString()
      .withMessage('Confirmação de senha inválida.')
      .notEmpty()
      .withMessage('Confirmação de senha é obrigatória.')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('As senhas não correspondem.');
        }
        return true;
      });
  }

  protected password() {
    return body('password')
      .trim()
      .isString()
      .withMessage('Senha inválida.')
      .notEmpty()
      .withMessage('Senha é obrigatória.')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres.')
      .custom((value) => {
        if (!passwordRegex.test(value)) {
          throw new Error(
            'A senha deve ter ao menos 1 letra maiúscula, 1 número e 1 caractere especial.'
          );
        }
        return true;
      })
      .customSanitizer(
        async (value: string): Promise<{ hashedPassword; salt }> => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(value, salt);
          return Promise.resolve({ hashedPassword, salt });
        }
      );
  }

  protected email() {
    return body('email')
      .trim()
      .isString()
      .withMessage('Email inválido.')
      .notEmpty()
      .withMessage('Email é obrigatório.')
      .isEmail()
      .withMessage('Email inválido.')
      .custom(async (value: string): Promise<boolean> => {
        const tutorRepository = MysqlDataSource.getRepository(Tutor);
        const studentRepository = MysqlDataSource.getRepository(Student);

        const existingTutor = await tutorRepository.findOne({
          where: { email: value }
        });

        const existingStudent = await studentRepository.findOne({
          where: { email: value }
        });

        if (existingTutor || existingStudent) {
          return Promise.reject('Email já cadastrado');
        }

        return true;
      });
  }

  protected educationLevel() {
    return body('educationLevelId')
      .trim()
      .isArray()
      .withMessage('Níveis de ensino inválidos.')
      .notEmpty()
      .withMessage('Níveis de ensino são obrigatórios.')
      .custom(async (value: string[]): Promise<boolean> => {
        const educationLevelRepository =
          MysqlDataSource.getRepository(EducationLevel);

        const parsedValues = value.map((id: string) => Number(id));
        const educationLevels = await educationLevelRepository.find({
          where: { educationId: In([parsedValues]) }
        });
        if (educationLevels.length !== value.length) {
          return Promise.reject('Uma ou mais faixas de ensino não existem.');
        }

        return true;
      });
  }
}
