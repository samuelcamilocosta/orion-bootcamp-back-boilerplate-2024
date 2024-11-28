import { Tutor } from '../entity/Tutor';
import { TutorRepository } from '../repository/TutorRepository';
import { UserService } from './UserService';
import { FileStorageService } from './FileStorageService';
import { SubjectRepository } from '../repository/SubjectRepository';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';
import { LessonRequestRepository } from '../repository/LessonRequestRepository';
import { LessonRequestTutorRepository } from '../repository/LessonRequestTutorRepository';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { EnumStatusName } from '../enum/EnumStatusName';
import { EnumUserType } from '../enum/EnumUserType';
import { AppError } from '../error/AppError';
import { handleError } from '../utils/ErrorHandler';
import { LessonRequestService } from './LessonRequestService';

export class TutorService extends UserService {
  static formatTutor(tutor: Tutor) {
    return {
      id: tutor.id,
      username: tutor.username,
      fullName: tutor.fullName,
      photoUrl: tutor.photoUrl,
      birthDate: tutor.birthDate,
      expertise: tutor.expertise,
      projectReason: tutor.projectReason,
      lessonRequestTutors: tutor.lessonRequestTutors
        ? tutor.lessonRequestTutors.map((lessonRequestTutor) => ({
            lessonRequestId: lessonRequestTutor.lessonRequest.ClassId,
            chosenDate: lessonRequestTutor.chosenDate,
            lessonRequest: LessonRequestService.formatLessonRequest(lessonRequestTutor.lessonRequest)
          }))
        : [],
      subjects: tutor.subjects
        ? tutor.subjects.map((subject) => ({
            id: subject.subjectId,
            name: subject.subjectName
          }))
        : []
    };
  }

  static async createTutor(tutorData) {
    try {
      const { fullName, username, birthDate, email, cpf, educationLevelIds, password } = tutorData;

      const { hashedPassword, salt } = password;

      const tutor = new Tutor();
      tutor.fullName = fullName;
      tutor.username = username;
      tutor.birthDate = birthDate;
      tutor.password = hashedPassword;
      tutor.email = email;
      tutor.cpf = cpf;
      tutor.salt = salt;

      const foundEducationLevels = await EducationLevelRepository.findEducationLevelsByIds(educationLevelIds);

      if (!foundEducationLevels || foundEducationLevels.length !== educationLevelIds.length) {
        throw new AppError(EnumErrorMessages.EDUCATION_LEVEL_NOT_FOUND, 404);
      }

      tutor.educationLevels = foundEducationLevels;
      const savedTutor = await TutorRepository.saveTutor(tutor);
      return UserService.generateUserResponse(savedTutor, EnumUserType.TUTOR);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async updateTutorPhoto(tutor, file: Express.Multer.File) {
    try {
      if (!tutor) {
        throw new AppError(EnumErrorMessages.TUTOR_NOT_FOUND, 404);
      }

      if (!file) {
        throw new AppError(EnumErrorMessages.PHOTO_REQUIRED, 400);
      }

      const photoUrl = await FileStorageService.uploadPhoto(file);
      tutor.photoUrl = photoUrl;

      return TutorRepository.saveTutor(tutor);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async updateTutorPersonalData(tutor: Tutor, expertise: string, projectReason: string, subjectIds: number[]) {
    try {
      const tutorFound = await TutorRepository.findTutorById(tutor.id);
      if (!tutorFound) {
        throw new AppError(EnumErrorMessages.TUTOR_NOT_FOUND, 404);
      }

      tutorFound.expertise = expertise;
      tutorFound.projectReason = projectReason;

      const foundSubjects = await SubjectRepository.findSubjectByIds(subjectIds);
      if (!foundSubjects || foundSubjects.length !== subjectIds.length) {
        throw new AppError(EnumErrorMessages.SUBJECT_NOT_FOUND, 404);
      }

      tutorFound.subjects = foundSubjects;

      return TutorRepository.saveTutor(tutorFound);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getTutorById(id: number) {
    try {
      const tutor = await TutorRepository.findTutorById(Number(id));

      if (!tutor) {
        throw new AppError(EnumErrorMessages.TUTOR_NOT_FOUND, 404);
      }

      return TutorService.formatTutor(tutor);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async getAllTutors() {
    try {
      const tutors = await TutorRepository.findAllTutors();
      if (!tutors) {
        throw new AppError(EnumErrorMessages.TUTOR_NOT_FOUND, 404);
      }

      return tutors.map(TutorService.formatTutor);
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }

  static async acceptLessonRequest(lessonId: number, tutorId: number, chosenDate: string) {
    try {
      const lessonRequest = await LessonRequestRepository.getLessonRequestById(lessonId);

      if (!lessonRequest) {
        throw new AppError(EnumErrorMessages.LESSON_REQUEST_NOT_FOUND, 404);
      }

      if (lessonRequest.status !== EnumStatusName.PENDENTE && lessonRequest.status !== EnumStatusName.ACEITO) {
        throw new AppError(EnumErrorMessages.INVALID_PENDENTE_ACEITO_STATUS, 400);
      }

      const tutor = await TutorRepository.findTutorById(tutorId);
      if (!tutor) {
        throw new AppError(EnumErrorMessages.TUTOR_NOT_FOUND, 404);
      }

      const existingLessonRequestTutor = await LessonRequestTutorRepository.findByLessonRequestAndTutor(lessonRequest.ClassId, tutor.id);

      if (existingLessonRequestTutor) {
        throw new AppError(EnumErrorMessages.TUTOR_ALREADY_ADDED, 400);
      }

      if (!lessonRequest.preferredDates.includes(chosenDate)) {
        throw new AppError(EnumErrorMessages.DATE_INVALID, 400);
      }

      lessonRequest.status = EnumStatusName.ACEITO;

      await LessonRequestRepository.saveLessonRequest(lessonRequest);

      await LessonRequestTutorRepository.createLessonRequestTutor(lessonRequest, tutor, chosenDate, lessonRequest.status);

      return true;
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }
}
