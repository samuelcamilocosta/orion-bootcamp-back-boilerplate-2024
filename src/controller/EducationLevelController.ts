import { Request, Response } from 'express';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';

export class EducationLevelController {
  async create(req: Request, res: Response) {
    const { levelType } = req.body;

    if (!levelType) {
      return res
        .status(400)
        .json({ message: 'Nível de ensino é obrigatório.' });
    }

    const educationLevel = new EducationLevel();
    educationLevel.levelType = levelType;

    try {
      await MysqlDataSource.getRepository(EducationLevel).save(educationLevel);
      return res.status(201).json(educationLevel);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Erro interno do servidor.', error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const educationLevels =
        await MysqlDataSource.getRepository(EducationLevel).find();
      return res.status(200).json(educationLevels);
    } catch (error) {
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }
}
