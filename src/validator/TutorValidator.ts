import { body } from 'express-validator';
import { cpf } from 'cpf-cnpj-validator';
import { Tutor } from '../entity/Tutor';
import { EducationLevel } from '../entity/EducationLevel';
import { BaseValidator } from './BaseValidator';
import { RequestHandler } from 'express';
import { MysqlDataSource } from '../config/database';
import * as bcrypt from 'bcrypt';

const birthDateRegex =
  /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2]|[0-9])\/\d{4}$/;
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%¨&*])[A-Za-z\d!@#$%¨&*]{6,}$/;
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export class TutorValidator extends BaseValidator {
  /**
   * Validate necessary data to create a new tutor.
   * @returns An express validation middleware array.
   */
  public static createTutor(): Array<RequestHandler> {
    return [
      body('fullName')
        .trim()
        .isString()
        .withMessage('Nome completo deve ser uma string.')
        .notEmpty()
        .withMessage('Nome completo é obrigatório.'),

      body('username')
        .trim()
        .isString()
        .withMessage('Nome de usuário deve ser uma string.')
        .notEmpty()
        .withMessage('Nome de usuário é obrigatório.'),

      body('birthDate')
        .trim()
        .isString()
        .withMessage('Data de nascimento deve ser uma string.')
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
          } else if (
            month === 4 ||
            month === 6 ||
            month === 9 ||
            month === 11
          ) {
            if (day > 30) {
              throw new Error(dateErrorMessage);
            }
          } else if (day > 31) {
            throw new Error(dateErrorMessage);
          }

          const currentDate = new Date();
          if (
            day > currentDate.getDay() &&
            month > currentDate.getMonth() &&
            year > currentDate.getFullYear()
          ) {
            throw new Error(dateErrorMessage);
          }

          return true;
        })
        .customSanitizer((value: string): string => {
          const [day, month, year] = value.split('/');
          const newBirthDate = `${year}-${month}-${day}`;

          return newBirthDate;
        }),

      body('password')
        .trim()
        .isString()
        .withMessage('Senha deve ser uma string.')
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
        ),
      
        body('confirmPassword')
        .trim()
        .isString()
        .withMessage('Confirmação de senha deve ser uma string.')
        .notEmpty()
        .withMessage('Confirmação de senha é obrigatória.')
        .custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('As senhas não correspondem.');
          }
          return true;
        }),  

      body('cpf')
        .trim()
        .isString()
        .withMessage('CPF deve ser uma string.')
        .notEmpty()
        .withMessage('CPF é obrigatório.')
        .custom((value: string): boolean => {
          if (!cpfRegex.test(value)) {
            throw new Error('Formato do CPF inválido.');
          }

          const cleanCpf = value.replace(/\D/g, '');
          if (!cpf.isValid(cleanCpf)) {
            throw new Error('CPF inválido.');
          }

          return true;
        })
        .custom(async (value: string): Promise<boolean> => {
          const tutorRepository = MysqlDataSource.getRepository(Tutor);
          const existingTutor = await tutorRepository.findOne({
            where: { cpf: value }
          });

          if (existingTutor) {
            return Promise.reject('CPF já cadastrado.');
          }

          return true;
        })
        .customSanitizer((value: string) => {
          const cleanCpf = value.replace(/\D/g, '');
          return cleanCpf;
        }),

      body('email')
        .trim()
        .isString()
        .withMessage('Email deve ser uma string.')
        .notEmpty()
        .withMessage('Email é obrigatório.')
        .isEmail()
        .withMessage('Email deve ser válido.')
        .custom(async (value: string): Promise<boolean> => {
          const tutorRepository = MysqlDataSource.getRepository(Tutor);
          const existingTutor = await tutorRepository.findOne({
            where: { email: value }
          });

          if (existingTutor) {
            return Promise.reject('Email já cadastrado');
          }

          return true;
        }),

      body('educationLevel')
        .trim()
        .isArray()
        .withMessage('Faixas de ensino devem ser uma lista de IDs.')
        .notEmpty()
        .withMessage('Faixas de ensino são obrigatória.')
        .custom(async (value: string[]): Promise<boolean> => {
          const educationLevelRepository =
            MysqlDataSource.getRepository(EducationLevel);

          const parsedValues = value.map((id: string) => Number(id));
          const educationLevels =
            await educationLevelRepository.findByIds(parsedValues);
          if (educationLevels.length !== value.length) {
            return Promise.reject('Uma ou mais faixas de ensino não existem.');
          }

          return true;
        })
    ];
  }
}
