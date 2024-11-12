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
        .custom((value: string): Promise<boolean> => {
          try {
            const cleanCpf = value.replace(/\D/g, '');
            if (!cpf.isValid(cleanCpf)) {
              return Promise.reject('CPF inválido.');
            }
            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject('Erro interno do servidor.');
          }
        })
        .custom(async (value: string): Promise<boolean> => {
          try {
            const cleanCpf = value.replace(/\D/g, '');
            const existingTutor =
              await TutorRepository.findTutorByCpf(cleanCpf);

            if (existingTutor) {
              return Promise.reject(
                'Não foi possível concluir o cadastro. Verifique os dados inseridos.'
              );
            }

            return true;
          } catch (error) {
            return Promise.reject('Erro interno do servidor.');
          }
        })
        .customSanitizer((value: string): string => {
          return value.replace(/\D/g, '');
        })
    ]);
  }
}
