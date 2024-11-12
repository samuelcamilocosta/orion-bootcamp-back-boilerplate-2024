import { body } from 'express-validator';
import { cpf } from 'cpf-cnpj-validator';
import { CommonValidations } from './CommonValidations';
import { BaseValidator } from './BaseValidator';
import { RequestHandler } from 'express';
import { TutorRepository } from '../repository/TutorRepository';

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
          const cleanCpf = value.replace(/\D/g, '');
          const existingTutor = await TutorRepository.findTutorByCpf(cleanCpf);

          if (existingTutor) {
            return Promise.reject(
              'Não foi possível concluir o cadastro. Verifique os dados inseridos.'
            );
          }

          return true;
        })
        .customSanitizer((value: string): string => {
          return value.replace(/\D/g, '');
        })
    ]);
  }
}
