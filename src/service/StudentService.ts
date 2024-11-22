import { Student } from '../entity/Student';
import { LessonRequestService } from './LessonRequestService';
import { UserService } from './UserService';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { StudentRepository } from '../repository/StudentRepository';
import { LessonRequestTutorRepository } from '../repository/LessonRequestTutorRepository';
import { handleError } from '../utils/ErrorHandler';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { EnumStatusName } from '../enum/EnumStatusName';
import { EnumUserType } from '../enum/EnumUserType';

export class StudentService extends UserService {
  static formatStudent(student: Student) {
    return {
      id: student.id,
      username: student.username,
      fullName: student.fullName,
      birthDate: student.birthDate,
      educationLevel: student.educationLevel,
      lessonRequests: student.lessonRequests
        ? student.lessonRequests.map((lessonRequest) =>
            LessonRequestService.formatLessonRequest(lessonRequest)
          )
        : []
    };
  }

  static async createStudent(studentData) {
    try {
      const {
        fullName,
        username,
        birthDate,
        email,
        educationLevelId,
        password
      } = studentData;
      const { hashedPassword, salt } = password;

      const student = new Student();
      student.fullName = fullName;
      student.username = username;
      student.birthDate = birthDate;
      student.password = hashedPassword;
      student.email = email;
      student.salt = salt;

      const foundEducationLevel =
        await EducationLevelRepository.findEducationLevelById(educationLevelId);

      if (!foundEducationLevel) {
        throw new AppError(EnumErrorMessages.EDUCATION_LEVEL_NOT_FOUND, 404);
      }

      student.educationLevel = foundEducationLevel;

      const savedStudent = await StudentRepository.saveStudent(student);
      return UserService.generateUserResponse(
        savedStudent,
        EnumUserType.STUDENT
      );
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getStudentById(id: number) {
    try {
      const student = await StudentRepository.findStudentById(id);
      if (!student) {
        throw new AppError(EnumErrorMessages.STUDENT_NOT_FOUND, 404);
      }
      return StudentService.formatStudent(student);
    } catch (error) {
      console.error('Error fetching student:', error); // Log completo do erro
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getAllStudents() {
    try {
      const students = await StudentRepository.findAllStudents();
      if (!students) {
        throw new AppError(EnumErrorMessages.STUDENT_NOT_FOUND, 404);
      }
      return students.map(StudentService.formatStudent);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getStudentLessonsByStatus(id: number, status: EnumStatusName) {
    try {
      const lessonRequests = await StudentRepository.findStudentLessonsByStatus(
        id,
        status
      );

      if (!lessonRequests || lessonRequests.length === 0) {
        throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
      }

      return lessonRequests.map((lessonRequest) =>
        LessonRequestService.formatLessonRequest(lessonRequest)
      );
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async confirmLessonRequest(lessonId: number, tutorId: number) {
    try {
      const lessonRequest =
        await LessonRequestRepository.getLessonRequestById(lessonId);

      if (!lessonRequest) {
        throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
      }

      if (lessonRequest.status === EnumStatusName.CONFIRMADO) {
        throw new AppError(
          EnumErrorMessages.LESSON_REQUEST_ALREADY_CONFIRMED,
          400
        );
      }

      if (lessonRequest.status !== EnumStatusName.ACEITO) {
        throw new AppError(EnumErrorMessages.INVALID_ACEITO_STATUS, 400);
      }

      const lessonRequestTutor =
        await LessonRequestTutorRepository.findByLessonRequestAndTutor(
          lessonId,
          tutorId
        );

      if (!lessonRequestTutor) {
        throw new AppError(EnumErrorMessages.TUTOR_NOT_FOUND, 404);
      }

      await LessonRequestTutorRepository.updateStatus(
        lessonRequestTutor.id,
        EnumStatusName.CONFIRMADO
      );

      lessonRequest.preferredDates = [lessonRequestTutor.chosenDate];

      lessonRequest.lessonRequestTutors =
        lessonRequest.lessonRequestTutors.filter(
          (lrt) => lrt.id === lessonRequestTutor.id
        );

      lessonRequest.status = EnumStatusName.CONFIRMADO;
      await LessonRequestRepository.saveLessonRequest(lessonRequest);

      return LessonRequestService.formatLessonRequest(lessonRequest);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }
}
