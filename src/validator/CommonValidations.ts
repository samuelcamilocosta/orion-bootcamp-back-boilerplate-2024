import { body } from 'express-validator';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../repository/UserRepository';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';

const birthDateRegex =
  /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}$/;

const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%¨&*])[A-Za-z\d!@#$%¨&*]{6,}$/;

export class CommonValidations {
  protected fullName() {
    return body('fullName')
      .trim()
      .isString()
      .withMessage('Nome completo inválido.')
      .notEmpty()
      .withMessage('Nome completo é obrigatório.');
  }

  protected username() {
    return body('username')
      .trim()
      .isString()
      .withMessage('Nome de usuário inválido.')
      .notEmpty()
      .withMessage('Nome de usuário é obrigatório.')
      .custom(async (value: string): Promise<boolean> => {
        try {
          const existingUser =
            await UserRepository.findExistingUserByUsername(value);

          if (existingUser) {
            return Promise.reject('Nome de usuário já cadastrado.');
          }

          return Promise.resolve(true);
        } catch (error) {
          return Promise.reject('Erro interno do servidor.');
        }
      });
  }

  protected birthDate() {
    return body('birthDate')
      .trim()
      .isString()
      .withMessage('Data de nascimento inválida.')
      .notEmpty()
      .withMessage('Data de nascimento é obrigatória.')
      .custom((value: string): Promise<boolean> => {
        if (!birthDateRegex.test(value)) {
          return Promise.reject(
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
            return Promise.reject(dateErrorMessage);
          }
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
          if (day > 30) {
            return Promise.reject(dateErrorMessage);
          }
        } else if (day > 31) {
          return Promise.reject(dateErrorMessage);
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
          return Promise.reject(
            'Data de nascimento não pode ser uma data futura.'
          );
        }

        return Promise.resolve(true);
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
      .withMessage('Confirmação de senha inválida.')
      .notEmpty()
      .withMessage('Confirmação de senha é obrigatória.')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          return Promise.reject('As senhas não coincidem.');
        }
        return true;
      });
  }

  protected password() {
    return body('password')
      .trim()
      .isString()
      .withMessage('Senha inválida.')
      .notEmpty()
      .withMessage('Senha é obrigatória.')
      .isLength({ min: 6 })
      .withMessage('Senha deve ter no mínimo 6 caracteres.')
      .custom((value) => {
        if (!passwordRegex.test(value)) {
          return Promise.reject(
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
      );
  }

  protected email() {
    return body('email')
      .trim()
      .isString()
      .withMessage('Email inválido.')
      .notEmpty()
      .withMessage('Email é obrigatório.')
      .isEmail()
      .withMessage('Email inválido.')
      .custom(async (value: string): Promise<boolean> => {
        try {
          const existingUser =
            await UserRepository.findExistingUserByEmail(value);

          if (existingUser) {
            return Promise.reject(
              'Não foi possível concluir o cadastro. Verifique os dados inseridos.'
            );
          }

          return Promise.resolve(true);
        } catch (error) {
          return Promise.reject('Erro interno do servidor.');
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
            return Promise.reject(
              'Somente um nível de ensino é permitido para educationLevelId.'
            );
          }

          if (
            (!educationLevelId && !educationLevelIds) ||
            (educationLevelId.length === 0 && educationLevelIds.length === 0)
          ) {
            return Promise.reject('Níveis de ensino são obrigatórios.');
          }

          if (educationLevelId && educationLevelIds) {
            return Promise.reject(
              'Não é permitido o envio de educationLevelId e educationLevelIds simultaneamente.'
            );
          }

          const educationLevels =
            educationLevelIds || (educationLevelId ? [educationLevelId] : []);

          const parsedValues = educationLevels.map((id: string) => Number(id));
          const existingEducationLevels =
            await EducationLevelRepository.findEducationLevelsByIds(
              parsedValues
            );

          if (existingEducationLevels.length !== parsedValues.length) {
            return Promise.reject('Um ou mais níveis de ensino não existem.');
          }

          return Promise.resolve(true);
        } catch (error) {
          if (error instanceof Error) {
            return Promise.reject(error.message);
          }
          return Promise.reject('Erro interno do servidor.');
        }
      });
  }
}
