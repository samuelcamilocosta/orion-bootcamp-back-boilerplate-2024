import { body } from 'express-validator';
import { EnumReasonName } from '../enum/EnumReasonName';
import { BaseValidator } from './BaseValidator';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { StudentRepository } from '../repository/StudentRepository';
import { SubjectRepository } from '../repository/SubjectRepository';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';

export class LessonRequestValidator {
  static createLessonRequest() {
    return BaseValidator.validationList([
      body('reason')
        .trim()
        .custom((value) => {
          try {
            const validReasons = Object.values(EnumReasonName);
            const invalidReason = EnumErrorMessages.REASON_INVALID.replace(
              '${validReasons}',
              validReasons.join(', ')
            );

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
            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject(EnumErrorMessages.INTERNAL_SERVER);
          }
        }),
      body('preferredDates')
        .isArray({ min: 1, max: 3 })
        .withMessage(EnumErrorMessages.PREFERRED_DATES_REQUIRED)
        .custom((value) => {
          try {
            const dateRegex =
              /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4} às \d{2}:\d{2}$/;
            for (const date of value) {
              if (typeof date !== 'string' || !dateRegex.test(date)) {
                return Promise.reject(EnumErrorMessages.DATE_FORMAT_INVALID);
              }
              const [day, month, yearTime] = date.split('/');
              const [year] = yearTime.split(' às ');
              const dateObject = new Date(`${year}-${month}-${day}`);
              if (
                dateObject.getFullYear() !== parseInt(year) ||
                dateObject.getMonth() + 1 !== parseInt(month) ||
                dateObject.getDate() !== parseInt(day)
              ) {
                return Promise.reject(EnumErrorMessages.DATE_INVALID);
              }
            }
            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject(EnumErrorMessages.INTERNAL_SERVER);
          }
        })
        .custom(async (value, { req }) => {
          try {
            const studentId = req.body.studentId;

            const uniqueDates = new Set(value);
            if (uniqueDates.size !== value.length) {
              return Promise.reject(
                EnumErrorMessages.DUPLICATE_PREFERRED_DATES
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
                    EnumErrorMessages.PAST_DATE_ERROR.replace('${date}', date)
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
                    EnumErrorMessages.TIME_INVALID.replace('${time}', time)
                  );
                }

                const existingLesson =
                  await LessonRequestRepository.findByPreferredDate(
                    formattedDate,
                    studentId
                  );
                if (existingLesson) {
                  return Promise.reject(
                    EnumErrorMessages.EXISTING_LESSON.replace('${date}', date)
                  );
                }
              })
            );
            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject(EnumErrorMessages.INTERNAL_SERVER);
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
        .withMessage(EnumErrorMessages.SUBJECT_ID_INVALID)
        .notEmpty()
        .withMessage(EnumErrorMessages.SUBJECT_ID_REQUIRED)
        .custom(async (value) => {
          try {
            const subject = await SubjectRepository.findSubjectById(value);
            if (!subject) {
              return Promise.reject(EnumErrorMessages.SUBJECT_NOT_FOUND);
            }
            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject(EnumErrorMessages.INTERNAL_SERVER);
          }
        }),
      body('studentId')
        .isInt()
        .withMessage(EnumErrorMessages.STUDENT_ID_INVALID)
        .notEmpty()
        .withMessage(EnumErrorMessages.STUDENT_ID_REQUIRED)
        .custom(async (value) => {
          try {
            const student = await StudentRepository.findStudentById(value);
            if (!student) {
              return Promise.reject(EnumErrorMessages.STUDENT_NOT_FOUND);
            }
            return Promise.resolve(true);
          } catch (error) {
            return Promise.reject(EnumErrorMessages.INTERNAL_SERVER);
          }
        }),
      body('additionalInfo')
        .optional()
        .isString()
        .withMessage(EnumErrorMessages.ADDITIONAL_INFO_STRING)
        .isLength({ max: 200 })
        .withMessage(EnumErrorMessages.ADDITIONAL_INFO_LENGTH)
    ]);
  }
}
