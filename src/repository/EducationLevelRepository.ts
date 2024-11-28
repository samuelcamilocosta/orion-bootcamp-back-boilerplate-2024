import { In } from 'typeorm';
import { MysqlDataSource } from '../config/database';
import { EducationLevel } from '../entity/EducationLevel';

export class EducationLevelRepository {
  static async saveEducationLevel(
    educationLevel: EducationLevel
  ): Promise<EducationLevel> {
    const repository = MysqlDataSource.getRepository(EducationLevel);
    return repository.save(educationLevel);
  }

  static async findAllEducationLevels() {
    const repository = MysqlDataSource.getRepository(EducationLevel);
    return repository.find();
  }

  static async findEducationLevelById(id: number) {
    const repository = MysqlDataSource.getRepository(EducationLevel);
    return repository.findOne({ where: { educationId: id } });
  }

  static async findEducationLevelsByIds(ids: number[]) {
    const repository = MysqlDataSource.getRepository(EducationLevel);
    return repository.find({ where: { educationId: In(ids) } });
  }
}
