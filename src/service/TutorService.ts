import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { TutorRepository } from '../repository/TutorRepository';
import { UserService } from './UserService';
import { In } from 'typeorm';
import { EducationLevel } from '../entity/EducationLevel';
import { EnumUserType } from '../entity/enum/EnumUserType';

export class TutorService extends UserService {
  static async createTutor(tutorData) {
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
    const foundEducationLevel = await MysqlDataSource.getRepository(
      EducationLevel
    ).find({
      where: { educationId: In(educationLevelIds) }
    });

    if (foundEducationLevel) {
      tutor.educationLevels = foundEducationLevel;
    }

    const savedTutor = await TutorRepository.createTutor(tutor);
    return UserService.generateUserResponse(savedTutor, EnumUserType.TUTOR);
  }

  static async getAllTutors() {
    return await TutorRepository.findAllTutors();
  }
}
