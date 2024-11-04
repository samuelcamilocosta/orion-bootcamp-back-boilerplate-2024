import { body } from 'express-validator';
import { ReasonName } from '../entity/enum/ReasonName';
import { StatusName } from '../entity/enum/StatusName';
import { Subject } from '../entity/Subject';
import { Student } from '../entity/Student';
import { MysqlDataSource } from '../config/database';
import { BaseValidator } from './BaseValidator';

export class LessonRequestValidator {
  static createLessonRequest() {
    return BaseValidator.validationList([
      body('reason')
        .isArray()
        .withMessage('Motivo da aula é obrigatório.')
        .custom((value) => {
          const validReasons = Object.values(ReasonName);
          value.forEach((reason) => {
            if (!validReasons.includes(reason)) {
              throw new Error('Motivo da aula inválido.');
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
            if (!dateRegex.test(date)) {
              throw new Error('Data inválida.');
            }
          });
          return true;
        })
        .customSanitizer((value) => {
          return value.map((date) => {
            const [day, month, yearTime] = date.split('/');
            const [year, time] = yearTime.split(' às ');
            return `${year}-${month}-${day} ${time}`;
          });
        }),
      body('subjectId')
        .isInt()
        .withMessage('O Id da matéria deve ser um número.')
        .notEmpty()
        .withMessage('Matéria é obrigatória.').custom(async (value) => {
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
        .withMessage('Aluno é obrigatório.').custom(async (value) => {
            const studentRepository = MysqlDataSource.getRepository(Student);
            const student = await studentRepository.findOne({
                where: { id: value }
            });

            if (!student) {
                return Promise.reject('Aluno não encontrado.');
            }
        }),
      body('additionalInformation')
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
