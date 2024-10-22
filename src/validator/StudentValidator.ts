import { body } from 'express-validator';
import { BaseValidator } from './BaseValidator';
import { RequestHandler } from 'express';
import * as bcrypt from 'bcrypt';

export class StudentValidator extends BaseValidator {
  /**
   * Validate necessary data to create a new tutor.
   * @returns An express validation middleware array.
   */
  public static createStudent(): Array<RequestHandler> {
    return [
      body('confirmPassword')
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
        }),

      body('password')
        .trim()
        .isString()
        .withMessage('Senha inválida.')
        .notEmpty()
        .withMessage('Senha é obrigatória.')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter no mínimo 6 caracteres.')
        .customSanitizer(
          async (value: string): Promise<{ hashedPassword; salt }> => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(value, salt);
            return Promise.resolve({ hashedPassword, salt });
          }
        )
    ];
  }
}
