import { body } from 'express-validator';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repository/UserRepository';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';

const birthDateRegex =
  /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%¨&*])[A-Za-z\d!@#$%¨&*]{6,}$/;

export class CommonValidations {
  protected fullName() {
    return body('fullName')
      .trim()
      .isString()
      .withMessage(EnumErrorMessages.FULL_NAME_INVALID)
      .notEmpty()
      .withMessage(EnumErrorMessages.FULL_NAME_REQUIRED);
  }

  protected username() {
    return body('username')
      .trim()
      .isString()
      .withMessage(EnumErrorMessages.USERNAME_INVALID)
      .notEmpty()
      .withMessage(EnumErrorMessages.USERNAME_REQUIRED)
      .custom(async (value: string): Promise<boolean> => {
        try {
          const existingUser =
            await UserRepository.findExistingUserByUsername(value);

          if (existingUser) {
            throw new Error(EnumErrorMessages.USERNAME_ALREADY_EXISTS);
          }

          return true;
        } catch (error) {
          throw new Error(EnumErrorMessages.INTERNAL_SERVER);
        }
      });
  }

  protected birthDate() {
    return body('birthDate')
      .trim()
      .isString()
      .withMessage(EnumErrorMessages.BIRTH_DATE_INVALID)
      .notEmpty()
      .withMessage(EnumErrorMessages.BIRTH_DATE_REQUIRED)
      .custom((value: string): boolean => {
        if (!birthDateRegex.test(value)) {
          throw new Error(EnumErrorMessages.BIRTH_DATE_FORMAT);
        }

        const [day, month, year] = value.split('/').map(Number);

        if (month === 2) {
          const isLeapYear =
            (year % 4 === 0 && year % 100 === 0) || year % 400 === 0
              ? true
              : false;
          if (day > 29 || (day === 29 && !isLeapYear)) {
            throw new Error(EnumErrorMessages.BIRTH_DATE_INCORRECT);
          }
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
          if (day > 30) {
            throw new Error(EnumErrorMessages.BIRTH_DATE_INCORRECT);
          }
        } else if (day > 31) {
          throw new Error(EnumErrorMessages.BIRTH_DATE_INCORRECT);
        }

        const now = new Date();
        const offset = now.getTimezoneOffset();

        const inputDate = new Date(Date.UTC(year, month - 1, day));
        const currentDate = new Date(
          Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
        );

        inputDate.setMinutes(inputDate.getMinutes() + offset);
        currentDate.setMinutes(currentDate.getMinutes() + offset);

        if (inputDate >= currentDate) {
          throw new Error(EnumErrorMessages.BIRTH_DATE_FUTURE);
        }

        return true;
      })
      .customSanitizer((value: string): Date => {
        const [day, month, year] = value.split('/');
        const date = new Date(
          Date.UTC(Number(year), Number(month) - 1, Number(day))
        );
        const offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() + offset);
        return date;
      });
  }

  protected confirmPassword() {
    return body('confirmPassword')
      .trim()
      .isString()
      .withMessage(EnumErrorMessages.CONFIRM_PASSWORD_INVALID)
      .notEmpty()
      .withMessage(EnumErrorMessages.CONFIRM_PASSWORD_REQUIRED)
      .custom((value, { req }): boolean => {
        if (value !== req.body.password) {
          throw new Error(EnumErrorMessages.PASSWORDS_NOT_MATCH);
        }
        return true;
      });
  }

  protected password() {
    return body('password')
      .trim()
      .isString()
      .withMessage(EnumErrorMessages.PASSWORD_INVALID)
      .notEmpty()
      .withMessage(EnumErrorMessages.PASSWORD_REQUIRED)
      .isLength({ min: 6 })
      .withMessage(EnumErrorMessages.PASSWORD_MIN_LENGTH)
      .custom((value): boolean => {
        if (!passwordRegex.test(value)) {
          throw new Error(EnumErrorMessages.PASSWORD_REQUIREMENTS);
        }
        return true;
      })
      .customSanitizer(
        async (value: string): Promise<{ hashedPassword; salt }> => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(value, salt);
          return { hashedPassword, salt };
        }
      );
  }

  protected email() {
    return body('email')
      .trim()
      .isString()
      .withMessage(EnumErrorMessages.EMAIL_INVALID)
      .notEmpty()
      .withMessage(EnumErrorMessages.EMAIL_REQUIRED)
      .isEmail()
      .withMessage(EnumErrorMessages.EMAIL_INVALID)
      .custom(async (value: string): Promise<boolean> => {
        try {
          const existingUser =
            await UserRepository.findExistingUserByEmail(value);

          if (existingUser) {
            throw new Error(EnumErrorMessages.EMAIL_ALREADY_EXISTS);
          }

          return true;
        } catch (error) {
          throw new Error(EnumErrorMessages.INTERNAL_SERVER);
        }
      });
  }

  protected educationLevel() {
    return body(['educationLevelId', 'educationLevelIds'])
      .trim()
      .custom(async (value, { req }) => {
        try {
          const educationLevelId = req.body.educationLevelId;
          const educationLevelIds = req.body.educationLevelIds;

          if (educationLevelId.length > 1) {
            throw new Error(EnumErrorMessages.EDUCATION_LEVEL_SINGLE);
          }

          if (
            (!educationLevelId && !educationLevelIds) ||
            (educationLevelId.length === 0 && educationLevelIds.length === 0)
          ) {
            throw new Error(EnumErrorMessages.EDUCATION_LEVEL_REQUIRED);
          }

          if (educationLevelId && educationLevelIds) {
            throw new Error(EnumErrorMessages.EDUCATION_LEVEL_CONFLICT);
          }

          const educationLevels =
            educationLevelIds || (educationLevelId ? [educationLevelId] : []);

          const parsedValues = educationLevels.map((id: string) => Number(id));
          const existingEducationLevels =
            await EducationLevelRepository.findEducationLevelsByIds(
              parsedValues
            );

          if (existingEducationLevels.length !== parsedValues.length) {
            throw new Error(EnumErrorMessages.EDUCATION_LEVEL_NOT_EXIST);
          }

          return true;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error(EnumErrorMessages.INTERNAL_SERVER);
        }
      });
  }
}
