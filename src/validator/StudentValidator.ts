import { CommonValidations } from './CommonValidations';
import { BaseValidator } from './BaseValidator';
import { RequestHandler } from 'express';

export class StudentValidator extends CommonValidations {
  /**
   * Validate necessary data to create a new student.
   * @returns An express validation middleware array.
   */
  public static createStudent(): Array<RequestHandler> {
    return BaseValidator.validationList([
      new StudentValidator().fullName(),
      new StudentValidator().username(),
      new StudentValidator().birthDate(),
      new StudentValidator().email(),
      new StudentValidator().confirmPassword(),
      new StudentValidator().password(),
      new StudentValidator().educationLevel()
    ]);
  }
}
