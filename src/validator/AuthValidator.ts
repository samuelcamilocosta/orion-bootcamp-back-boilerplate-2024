import { body } from 'express-validator';
import { BaseValidator } from './BaseValidator';

export class AuthValidator extends BaseValidator {
  /**
   * Validate necessary data to login a user.
   * @returns An express validation middleware array.
   */
  static login() {
    return this.validationList([
      body('email')
        .trim()
        .isString()
        .withMessage('Email inválido.')
        .notEmpty()
        .withMessage('Email é obrigatório.')
        .isEmail()
        .withMessage('Email inválido.'),

      body('password')
        .trim()
        .isString()
        .withMessage('Senha inválida.')
        .notEmpty()
        .withMessage('Senha é obrigatória.')
    ]);
  }
}
