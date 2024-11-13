import { MysqlDataSource } from '../config/database';
import { LessonRequest } from '../entity/LessonRequest';
import { Repository } from 'typeorm';

export class LessonRequestRepository {
  private get repo(): Repository<LessonRequest> {
    return MysqlDataSource.getRepository(LessonRequest);
  }

  async findByClassId(ClassId: number): Promise<LessonRequest[]> {
    return this.repo.find({ where: { ClassId } });
  }

  async deleteByClassId(ClassId: number) {
    await this.repo.delete({ ClassId });
  }
}
