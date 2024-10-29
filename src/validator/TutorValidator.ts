import { body } from 'express-validator';
import { cpf } from 'cpf-cnpj-validator';
import { Tutor } from '../entity/Tutor';
import { MysqlDataSource } from '../config/database';
import { CommonValidations } from './CommonValidations';
import { BaseValidator } from './BaseValidator';
import { RequestHandler } from 'express';

export class TutorValidator extends CommonValidations {
  /**
   * Validate necessary data to create a new tutor.
   * @returns An express validation middleware array.
   */
  public static createTutor(): Array<RequestHandler> {
    return BaseValidator.validationList([
      new TutorValidator().fullName(),
      new TutorValidator().username(),
      new TutorValidator().birthDate(),
      new TutorValidator().email(),
      new TutorValidator().confirmPassword(),
      new TutorValidator().password(),
      new TutorValidator().educationLevel(),

      body('cpf')
        .trim()
        .isString()
        .withMessage('CPF inválido.')
        .notEmpty()
        .withMessage('CPF é obrigatório.')
        .custom((value: string): boolean => {
          const cleanCpf = value.replace(/\D/g, '');
          if (!cpf.isValid(cleanCpf)) {
            throw new Error('CPF inválido.');
          }
          return true;
        })
        .custom(async (value: string): Promise<boolean> => {
          const tutorRepository = MysqlDataSource.getRepository(Tutor);
          const cleanCpf = value.replace(/\D/g, '');
          const existingTutor = await tutorRepository.findOne({
            where: { cpf: cleanCpf }
          });

          if (existingTutor) {
            return Promise.reject('CPF já cadastrado.');
          }

          return true;
        })
        .customSanitizer((value: string): string => {
          return value.replace(/\D/g, '');
        })
    ]);
  }
}
