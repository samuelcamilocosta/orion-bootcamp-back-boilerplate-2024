import { body } from 'express-validator';
import { ReasonName } from '../entity/enum/ReasonName';
import { Subject } from '../entity/Subject';
import { Student } from '../entity/Student';
import { MysqlDataSource } from '../config/database';
import { BaseValidator } from './BaseValidator';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';

export class LessonRequestValidator {
  static createLessonRequest() {
    return BaseValidator.validationList([
      body('reason')
        .trim()
        .custom((value) => {
          const validReasons = Object.values(ReasonName);
          const invalidReason = `Motivo da aula inválido. Deve conter ao menos um desses: ${validReasons.join(', ')}`;
          if (!Array.isArray(value)) {
            throw new Error(invalidReason);
          }

          value.forEach((reason: ReasonName) => {
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
          const dateRegex = /^\d{2}\/\d{2}\/\d{4} às \d{2}:\d{2}$/;
          value.forEach((date) => {
            if (typeof date !== 'string' || !dateRegex.test(date)) {
              throw new Error(
                'Data inválida. O formato correto é dd/MM/yyyy às HH:mm.'
              );
            }
          });
          return true;
        })
        .custom(async (value, { req }) => {
          const studentId = req.body.studentId;
          const datePromises = value.map(async (date) => {
            const [day, month, yearTime] = date.split('/');
            const [year, time] = yearTime.split(' às ');
            const formattedDate = `${year}-${month}-${day} ${time}`;

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
          const subjectRepository = MysqlDataSource.getRepository(Subject);
          const subject = await subjectRepository.findOne({
            where: { subjectId: value }
          });

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
          const studentRepository = MysqlDataSource.getRepository(Student);
          const student = await studentRepository.findOne({
            where: { id: value }
          });

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
