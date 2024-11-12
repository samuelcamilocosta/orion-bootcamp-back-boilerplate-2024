import { body } from 'express-validator';
import { EnumReasonName } from '../entity/enum/EnumReasonName';
import { BaseValidator } from './BaseValidator';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { StudentRepository } from '../repository/StudentRepository';
import { SubjectRepository } from '../repository/SubjectRepository';

export class LessonRequestValidator {
  static createLessonRequest() {
    return BaseValidator.validationList([
      body('reason')
        .trim()
        .custom((value) => {
          try {
            const validReasons = Object.values(EnumReasonName);
            const invalidReason = `Motivo da aula inválido. Deve conter ao menos um desses: ${validReasons.join(', ')}`;

            if (!Array.isArray(value)) {
              return Promise.reject(invalidReason);
            }

            for (const reason of value) {
              if (
                typeof reason !== 'string' ||
                !validReasons.includes(reason as EnumReasonName)
              ) {
                return Promise.reject(invalidReason);
              }
            }
            return true;
          } catch (error) {
            return Promise.reject('Erro interno do servidor.');
          }
        }),
      body('preferredDates')
        .isArray({ min: 1, max: 3 })
        .withMessage(
          'Datas preferidas são obrigatórias. Mínimo de 1 e máximo de 3.'
        )
        .custom((value) => {
          try {
            const dateRegex =
              /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4} às \d{2}:\d{2}$/;
            for (const date of value) {
              if (typeof date !== 'string' || !dateRegex.test(date)) {
                return Promise.reject(
                  'Data inválida. O formato correto é dd/MM/yyyy às HH:mm.'
                );
              }
              const [day, month, yearTime] = date.split('/');
              const [year] = yearTime.split(' às ');
              const dateObject = new Date(`${year}-${month}-${day}`);
              if (
                dateObject.getFullYear() !== parseInt(year) ||
                dateObject.getMonth() + 1 !== parseInt(month) ||
                dateObject.getDate() !== parseInt(day)
              ) {
                return Promise.reject(
                  'Data inválida. Verifique se a data existe.'
                );
              }
            }
            return true;
          } catch (error) {
            return Promise.reject('Erro interno do servidor.');
          }
        })
        .custom(async (value, { req }) => {
          try {
            const studentId = req.body.studentId;

            const uniqueDates = new Set(value);
            if (uniqueDates.size !== value.length) {
              return Promise.reject(
                'Datas preferidas não podem ser duplicadas.'
              );
            }

            await Promise.all(
              value.map(async (date) => {
                const [day, month, yearTime] = date.split('/');
                const [year, time] = yearTime.split(' às ');
                const formattedDate = `${year}-${month}-${day} ${time}`;

                const lessonDate = new Date(formattedDate);
                const now = new Date();
                if (lessonDate < now) {
                  return Promise.reject(
                    `A data e hora não podem ser no passado: ${date}`
                  );
                }

                const [hour, minute] = time.split(':');
                if (
                  parseInt(hour) < 0 ||
                  parseInt(hour) > 23 ||
                  parseInt(minute) < 0 ||
                  parseInt(minute) > 59
                ) {
                  return Promise.reject(
                    `A aula não pode ser agendada antes de 00:00 e depois de 23:59. Horário escolhido: ${time}`
                  );
                }

                const existingLesson =
                  await LessonRequestRepository.findByPreferredDate(
                    formattedDate,
                    studentId
                  );
                if (existingLesson) {
                  return Promise.reject(
                    `Já existe uma aula agendada para o aluno nesse horário: ${date}`
                  );
                }
              })
            );

            return Promise.resolve(true);
          } catch (error) {
            if (error instanceof Error) {
              return Promise.reject(error.message);
            }
            return Promise.reject('Erro interno do servidor.');
          }
        })
        .customSanitizer((value) => {
          return value.map((date) => {
            if (typeof date === 'string' && date.includes('/')) {
              const [day, month, yearTime] = date.split('/');
              const [year, time] = yearTime.split(' às ');
              return `${year}-${month}-${day} ${time}`;
            }
          });
        }),
      body('subjectId')
        .isInt()
        .withMessage('O Id da matéria deve ser um número.')
        .notEmpty()
        .withMessage('Matéria é obrigatória.')
        .custom(async (value) => {
          try {
            const subject = await SubjectRepository.findSubjectById(value);

            if (!subject) {
              return Promise.reject('Matéria não encontrada.');
            }

            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject('Erro interno do servidor.');
          }
        }),
      body('studentId')
        .isInt()
        .withMessage('O Id do aluno deve ser um número.')
        .notEmpty()
        .withMessage('Aluno é obrigatório.')
        .custom(async (value) => {
          try {
            const student = await StudentRepository.findStudentById(value);

            if (!student) {
              return Promise.reject('Aluno não encontrado.');
            }

            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject('Erro interno do servidor.');
          }
        }),
      body('additionalInfo')
        .optional()
        .isString()
        .withMessage('Informações adicionais devem ser uma string.')
        .isLength({ max: 200 })
        .withMessage(
          'Informações adicionais deve ter no máximo 200 caracteres.'
        )
    ]);
  }
}
