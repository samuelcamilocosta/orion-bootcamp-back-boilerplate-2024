import { Tutor } from '../entity/Tutor';
import { TutorRepository } from '../repository/TutorRepository';
import { UserService } from './UserService';
import { EnumUserType } from '../entity/enum/EnumUserType';
import sharp from 'sharp';
import { bucketName, randomImgName, s3 } from '../config/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { SubjectRepository } from '../repository/SubjectRepository';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';

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
    const foundEducationLevels =
      await EducationLevelRepository.findEducationLevelsByIds(
        educationLevelIds
      );

    if (foundEducationLevels) {
      tutor.educationLevels = foundEducationLevels;
    }

    const savedTutor = await TutorRepository.saveTutor(tutor);
    return UserService.generateUserResponse(savedTutor, EnumUserType.TUTOR);
  }

  static async updateTutorPhoto(tutor: Tutor, file: Express.Multer.File) {
    const buffer = await sharp(file.buffer)
      .resize({
        height: 300,
        width: 300,
        fit: 'cover'
      })
      .toBuffer();

    const randomName = randomImgName();
    const params = {
      Bucket: bucketName,
      Key: randomName,
      Body: buffer,
      ContentType: file.mimetype
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const photoUrl = `https://orion-photos.s3.sa-east-1.amazonaws.com/${randomName}`;

    tutor.photoUrl = photoUrl;
    return await TutorRepository.saveTutor(tutor);
  }

  static async updateTutorPersonalData(
    tutor: Tutor,
    expertise: string,
    projectReason: string,
    subjectIds: number[]
  ) {
    tutor.expertise = expertise;
    tutor.projectReason = projectReason;
    const foundSubjects = await SubjectRepository.findSubjectByIds(subjectIds);

    tutor.subjects = foundSubjects;
    return await TutorRepository.saveTutor(tutor);
  }
}
