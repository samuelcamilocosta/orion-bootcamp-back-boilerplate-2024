import { body } from 'express-validator';
import { BaseValidator } from './BaseValidator';
import { EnumErrorMessages } from '../error/enum/EnumErrorMessages';

export class AuthValidator extends BaseValidator {
  /**
   * Validate necessary data to login a user.
   * @returns An express validation middleware array.
   */
  static login() {
    return this.validationList([
      body('email')
        .trim()
        .notEmpty()
        .withMessage(EnumErrorMessages.EMAIL_REQUIRED)
        .isEmail()
        .withMessage(EnumErrorMessages.EMAIL_INVALID),

      body('password')
        .trim()
        .isString()
        .withMessage(EnumErrorMessages.PASSWORD_INVALID)
        .notEmpty()
        .withMessage(EnumErrorMessages.PASSWORD_REQUIRED)
    ]);
  }
}
