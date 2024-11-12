import { In } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';

export class EducationLevelRepository {
  static async saveEducationLevel(
    educationLevel: EducationLevel
  ): Promise<EducationLevel> {
    const repository = MysqlDataSource.getRepository(EducationLevel);
    return await repository.save(educationLevel);
  }

  static async findAllEducationLevels() {
    const repository = MysqlDataSource.getRepository(EducationLevel);
    return await repository.find();
  }

  static async findEducationLevelById(ids: number[]) {
    const repository = MysqlDataSource.getRepository(EducationLevel);
    return await repository.find({ where: { educationId: In(ids) } });
  }
}
