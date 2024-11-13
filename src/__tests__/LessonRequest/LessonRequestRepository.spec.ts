import { MysqlDataSource } from '../../config/database';
import { LessonRequest } from '../../entity/LessonRequest';
import { LessonRequestRepository } from '../../repository/LessonRequestRepository';
import { Repository } from 'typeorm';

jest.mock('../../config/database');

describe('LessonRequestRepository - deleteByClassId', () => {
  let repository: LessonRequestRepository;
  let mockRepo: jest.Mocked<Repository<LessonRequest>>;

  beforeEach(() => {
    repository = new LessonRequestRepository();
    mockRepo = {
      delete: jest.fn()
    } as unknown as jest.Mocked<Repository<LessonRequest>>;
    (MysqlDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete lesson requests by ClassId successfully', async () => {
    const classId = 1;
    mockRepo.delete.mockResolvedValueOnce({ affected: 1, raw: {} });

    await repository.deleteByClassId(classId);

    expect(mockRepo.delete).toHaveBeenCalledWith({ ClassId: classId });
  });

  it('should handle errors during deletion', async () => {
    const classId = 1;
    const error = new Error('Deletion error');
    mockRepo.delete.mockRejectedValueOnce(error);

    await expect(repository.deleteByClassId(classId)).rejects.toThrow(
      'Deletion error'
    );
  });
});
