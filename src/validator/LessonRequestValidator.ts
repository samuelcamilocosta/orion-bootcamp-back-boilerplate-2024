import { body } from 'express-validator';
import { EnumReasonName } from '../enum/EnumReasonName';
import { BaseValidator } from './BaseValidator';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { StudentRepository } from '../repository/StudentRepository';
import { SubjectRepository } from '../repository/SubjectRepository';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { AppError } from '../error/AppError';
import { handleError } from '../utils/ErrorHandler';

export class LessonRequestValidator {
  static createLessonRequest() {
    return BaseValidator.validationList([
      body('reason')
        .trim()
        .custom((value): boolean => {
          const validReasons = Object.values(EnumReasonName);
          const invalidReason = EnumErrorMessages.REASON_INVALID.replace(
            '${validReasons}',
            validReasons.join(', ')
          );

          if (!Array.isArray(value)) {
            throw new AppError(invalidReason);
          }

          if (value.length === 0) {
            throw new AppError(invalidReason);
          }

          for (const reason of value) {
            if (
              typeof reason !== 'string' ||
              !validReasons.includes(reason as EnumReasonName)
            ) {
              throw new AppError(invalidReason);
            }
          }
          return true;
        }),
      body('preferredDates')
        .isArray({ min: 1, max: 3 })
        .withMessage(EnumErrorMessages.PREFERRED_DATES_REQUIRED)
        .custom((value): boolean => {
          const dateRegex =
            /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4} às \d{2}:\d{2}$/;
          for (const date of value) {
            if (typeof date !== 'string' || !dateRegex.test(date)) {
              throw new Error(EnumErrorMessages.DATE_FORMAT_INVALID);
            }
            const [day, month, yearTime] = date.split('/');
            const [year] = yearTime.split(' às ');
            const dateObject = new Date(`${year}-${month}-${day}`);
            if (
              dateObject.getFullYear() !== parseInt(year) ||
              dateObject.getMonth() + 1 !== parseInt(month) ||
              dateObject.getDate() !== parseInt(day)
            ) {
              throw new AppError(EnumErrorMessages.DATE_INVALID);
            }
          }
          return true;
        })
        .custom(async (value, { req }) => {
          try {
            const studentId = req.body.studentId;

            const uniqueDates = new Set(value);
            if (uniqueDates.size !== value.length) {
              throw new AppError(EnumErrorMessages.DUPLICATE_PREFERRED_DATES);
            }

            await Promise.all(
              value.map(async (date) => {
                const [day, month, yearTime] = date.split('/');
                const [year, time] = yearTime.split(' às ');
                const formattedDate = `${year}-${month}-${day} ${time}`;

                const lessonDate = new Date(formattedDate);
                const now = new Date();
                if (lessonDate < now) {
                  throw new AppError(
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
                  throw new AppError(
                    EnumErrorMessages.TIME_INVALID.replace('${time}', time)
                  );
                }

                const existingLesson =
                  await LessonRequestRepository.findByPreferredDate(
                    formattedDate,
                    studentId
                  );

                if (existingLesson) {
                  throw new AppError(
                    EnumErrorMessages.EXISTING_LESSON.replace('${date}', date)
                  );
                }
              })
            );
            return true;
          } catch (error) {
            const { statusCode, message } = handleError(error);
            throw new AppError(message, statusCode);
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
              throw new AppError(EnumErrorMessages.SUBJECT_NOT_FOUND);
            }
            return true;
          } catch (error) {
            const { statusCode, message } = handleError(error);
            throw new AppError(message, statusCode);
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
              throw new AppError(EnumErrorMessages.STUDENT_NOT_FOUND);
            }
            return true;
          } catch (error) {
            const { statusCode, message } = handleError(error);
            throw new AppError(message, statusCode);
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
