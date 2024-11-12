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
          const validReasons = Object.values(EnumReasonName);
          const invalidReason = `Motivo da aula inválido. Deve conter ao menos um desses: ${validReasons.join(', ')}`;
          if (!Array.isArray(value)) {
            throw new Error(invalidReason);
          }

          value.forEach((reason: EnumReasonName) => {
            if (typeof reason !== 'string' || !validReasons.includes(reason)) {
              throw new Error(invalidReason);
            }
          });
          return true;
        }),
      body('preferredDates')
        .isArray({ min: 1, max: 3 })
        .withMessage(
          'Datas preferidas são obrigatórias. Mínimo de 1 e máximo de 3.'
        )
        .custom((value) => {
          const dateRegex =
            /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4} às \d{2}:\d{2}$/;
          value.forEach((date) => {
            if (typeof date !== 'string' || !dateRegex.test(date)) {
              throw new Error(
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
              throw new Error('Data inválida. Verifique se a data existe.');
            }
          });
          return true;
        })
        .custom(async (value, { req }) => {
          const studentId = req.body.studentId;

          const uniqueDates = new Set(value);
          if (uniqueDates.size !== value.length) {
            throw new Error('Datas preferidas não podem ser duplicadas.');
          }

          const datePromises = value.map(async (date) => {
            const [day, month, yearTime] = date.split('/');
            const [year, time] = yearTime.split(' às ');
            const formattedDate = `${year}-${month}-${day} ${time}`;

            const lessonDate = new Date(formattedDate);
            const now = new Date();
            if (lessonDate < now) {
              throw new Error(
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
              throw new Error(
                `A aula não pode ser agendada antes de 00:00 e depois de 23:59. Horário escolhido: ${time}`
              );
            }

            const existingLesson =
              await LessonRequestRepository.findByPreferredDate(
                formattedDate,
                studentId
              );
            if (existingLesson) {
              throw new Error(
                `Já existe uma aula agendada para o aluno nesse horário: ${date}`
              );
            }
          });

          await Promise.all(datePromises);
          return true;
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
          const subject = await SubjectRepository.findSubjectById(value);

          if (!subject) {
            return Promise.reject('Matéria não encontrada.');
          }

          return true;
        }),
      body('studentId')
        .isInt()
        .withMessage('O Id do aluno deve ser um número.')
        .notEmpty()
        .withMessage('Aluno é obrigatório.')
        .custom(async (value) => {
          const student = await StudentRepository.findStudentById(value);

          if (!student) {
            return Promise.reject('Aluno não encontrado.');
          }

          return true;
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
