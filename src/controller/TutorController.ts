import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { Tutor } from '../entity/Tutor';
import { EducationLevel } from '../entity/EducationLevel';
import { In } from 'typeorm';
import { AuthService } from '../service/AuthService';
import { Subject } from '../entity/Subject';
import sharp from 'sharp';
import { randomImgName, s3, bucketName } from '../config/s3Client';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export class TutorController {
  async create(req: Request, res: Response) {
    const {
      fullName,
      username,
      birthDate,
      email,
      cpf,
      educationLevelIds,
      password
    } = req.body;

    const { hashedPassword, salt } = password;

    const tutor = new Tutor();
    tutor.fullName = fullName;
    tutor.username = username;
    tutor.birthDate = birthDate;
    tutor.password = hashedPassword;
    tutor.email = email;
    tutor.cpf = cpf;
    tutor.salt = salt;

    try {
      const foundEducationLevel = await MysqlDataSource.getRepository(
        EducationLevel
      ).find({
        where: { educationId: In(educationLevelIds) }
      });

      if (foundEducationLevel) {
        tutor.educationLevels = foundEducationLevel;
      }

      await MysqlDataSource.getRepository(Tutor).save(tutor);

      const token = AuthService.generateToken(tutor.id, tutor.email, 'tutor');

      return res.status(201).json({
        message: 'Tutor criado com sucesso.',
        tutorId: tutor.id,
        token: token
      });
    } catch (error) {
      console.error('Error saving tutor:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const tutor = await MysqlDataSource.getRepository(Tutor).find({
        select: [
          'id',
          'cpf',
          'username',
          'email',
          'fullName',
          'photoUrl',
          'educationLevels',
          'lessonRequests',
          'subjects'
        ],
        relations: ['educationLevels', 'lessonRequests', 'subjects']
      });
      return res.status(200).json(tutor);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  async updatePersonalData(req: Request, res: Response) {
    const { expertise, projectReason, subject: subjectIds, id } = req.body;

    try {
      const tutorRepository = MysqlDataSource.getRepository(Tutor);
      const tutor = await tutorRepository.findOne({
        where: { id },
        relations: ['subjects']
      });

      if (!tutor) {
        return res.status(404).json({ message: 'Tutor não encontrado' });
      }

      tutor.expertise = expertise ?? tutor.expertise;
      tutor.projectReason = projectReason ?? tutor.projectReason;

      if (Array.isArray(subjectIds) && subjectIds.length > 0) {
        const foundSubjects = await MysqlDataSource.getRepository(
          Subject
        ).findBy({
          subjectId: In(subjectIds)
        });

        tutor.subjects =
          foundSubjects.length > 0 ? foundSubjects : tutor.subjects;
      }

      await tutorRepository.save(tutor);

      return res.status(200).json({ message: 'Tutor atualizado com sucesso' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao atualizar o tutor', error });
    }
  }

  async updatePhoto(req: Request, res: Response) {
    const { id } = req.body;

    let buffer: Buffer;

    try {
      buffer = await sharp(req.file.buffer)
        .resize({
          height: 300,
          width: 300,
          fit: 'cover'
        })
        .toBuffer();
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao processar a imagem', error });
    }

    try {
      const randomName = randomImgName();
      const params = {
        Bucket: bucketName,
        Key: randomName,
        Body: buffer,
        ContentType: req.file.mimetype
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const tutorRepository = MysqlDataSource.getRepository(Tutor);
      const tutor = await tutorRepository.findOne({ where: { id } });

      if (!tutor) {
        return res.status(404).json({ message: 'Tutor não encontrado' });
      }
      const photoUrl = `https://orion-photos.s3.sa-east-1.amazonaws.com/${randomName}`;
      tutor.photoUrl = photoUrl;
      await tutorRepository.save(tutor);

      return res.status(200).json({ message: 'Foto atualizada com sucesso' });
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro ao atualizar a foto', error });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const tutor = await MysqlDataSource.getRepository(Tutor).findOne({
        where: { id: Number(id) },
        select: [
          'id',
          'cpf',
          'username',
          'email',
          'fullName',
          'educationLevels',
          'lessonRequests',
          'subjects'
        ],
        relations: ['educationLevels', 'lessonRequests', 'subjects']
      });

      if (!tutor) {
        return res.status(404).json({ message: 'Tutor não encontrado.' });
      }

      return res.status(200).json(tutor);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
