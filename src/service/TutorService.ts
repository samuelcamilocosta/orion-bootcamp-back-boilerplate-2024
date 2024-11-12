import { Tutor } from '../entity/Tutor';
import { TutorRepository } from '../repository/TutorRepository';
import { UserService } from './UserService';
import { EnumUserType } from '../entity/enum/EnumUserType';
import { S3Service } from './S3Service';
import { SubjectRepository } from '../repository/SubjectRepository';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';

export class TutorService extends UserService {
  static async createTutor(tutorData) {
    try {
      const {
        fullName,
        username,
        birthDate,
        email,
        cpf,
        educationLevelIds,
        password
      } = tutorData;

      const { hashedPassword, salt } = password;

      const tutor = new Tutor();
      tutor.fullName = fullName;
      tutor.username = username;
      tutor.birthDate = birthDate;
      tutor.password = hashedPassword;
      tutor.email = email;
      tutor.cpf = cpf;
      tutor.salt = salt;

      const foundEducationLevels =
        await EducationLevelRepository.findEducationLevelsByIds(
          educationLevelIds
        );

      if (
        !foundEducationLevels ||
        foundEducationLevels.length !== educationLevelIds.length
      ) {
        throw new Error('Um ou mais níveis de ensino não encontrados.');
      }

      tutor.educationLevels = foundEducationLevels;
      const savedTutor = await TutorRepository.saveTutor(tutor);
      return UserService.generateUserResponse(savedTutor, EnumUserType.TUTOR);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor.');
    }
  }

  static async updateTutorPhoto(tutor: Tutor, file: Express.Multer.File) {
    try {
      if (!tutor) {
        throw new Error('Tutor não encontrado.');
      }

      if (!file) {
        throw new Error('Arquivo de foto é obrigatório.');
      }

      const photoUrl = await S3Service.uploadPhoto(file);
      tutor.photoUrl = photoUrl;

      return await TutorRepository.saveTutor(tutor);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor.');
    }
  }

  static async updateTutorPersonalData(
    tutor: Tutor,
    expertise: string,
    projectReason: string,
    subjectIds: number[]
  ) {
    try {
      if (!tutor) {
        throw new Error('Tutor não encontrado.');
      }
      tutor.expertise = expertise;
      tutor.projectReason = projectReason;

      const foundSubjects =
        await SubjectRepository.findSubjectByIds(subjectIds);
      if (foundSubjects.length !== subjectIds.length) {
        throw new Error('Uma ou mais matérias não foram encontradas.');
      }

      tutor.subjects = foundSubjects;
      return await TutorRepository.saveTutor(tutor);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor.');
    }
  }

  static async getTutorById(id: number) {
    try {
      const tutor = await TutorRepository.findTutorById(Number(id));

      if (!tutor) {
        throw new Error('Tutor não encontrado.');
      }

      return tutor;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro interno do servidor.');
    }
  }

  static async getAllTutors() {
    const tutors = await TutorRepository.findAllTutors();
    if (!tutors) {
      throw new Error('Nenhum tutor encontrado.');
    }
    return tutors;
  }
}
