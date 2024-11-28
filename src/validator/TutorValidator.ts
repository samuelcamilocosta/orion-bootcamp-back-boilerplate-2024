import { body } from 'express-validator';
import { cpf } from 'cpf-cnpj-validator';
import { CommonValidations } from './CommonValidations';
import { BaseValidator } from './BaseValidator';
import { RequestHandler } from 'express';
import { TutorRepository } from '../repository/TutorRepository';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { AppError } from '../error/AppError';
import { handleError } from '../utils/ErrorHandler';

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
        .withMessage(EnumErrorMessages.CPF_INVALID)
        .notEmpty()
        .withMessage(EnumErrorMessages.CPF_REQUIRED)
        .custom((value: string): boolean => {
          try {
            const cleanCpf = value.replace(/\D/g, '');
            if (!cpf.isValid(cleanCpf)) {
              throw new AppError(EnumErrorMessages.CPF_INVALID);
            }
            return true;
          } catch (error) {
            const { statusCode, message } = handleError(error);
            throw new AppError(message, statusCode);
          }
        })
        .custom(async (value: string): Promise<boolean> => {
          try {
            const cleanCpf = value.replace(/\D/g, '');
            const existingTutor = await TutorRepository.findTutorByCpf(cleanCpf);

            if (existingTutor) {
              throw new AppError(EnumErrorMessages.CPF_ALREADY_EXISTS);
            }

            return true;
          } catch (error) {
            const { statusCode, message } = handleError(error);
            throw new AppError(message, statusCode);
          }
        })
        .customSanitizer((value: string): string => {
          return value.replace(/\D/g, '');
        })
    ]);
  }
}
