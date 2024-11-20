import { MysqlDataSource } from '../../config/database';
import { LessonRequest } from '../../entity/LessonRequest';
import { LessonRequestRepository } from '../../repository/LessonRequestRepository';
import { Repository } from 'typeorm';

jest.mock('../../config/database');

describe('LessonRequestRepository - deleteByClassId', () => {
  let mockRepo: jest.Mocked<Repository<LessonRequest>>;

  beforeEach(() => {
    mockRepo = {
      delete: jest.fn()
    } as unknown as jest.Mocked<Repository<LessonRequest>>;
    (MysqlDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve excluir solicitações de aula com sucesso pelo ClassId', async () => {
    const classId = 1;

    mockRepo.delete.mockResolvedValueOnce({ affected: 1, raw: {} });

    await LessonRequestRepository.deleteByClassId(classId);

    expect(mockRepo.delete).toHaveBeenCalledWith({ ClassId: classId });
  });

  it('deve lidar com erros durante a exclusão', async () => {
    const classId = 1;
    const error = new Error('Erro na exclusão');

    mockRepo.delete.mockRejectedValueOnce(error);

    await expect(
      LessonRequestRepository.deleteByClassId(classId)
    ).rejects.toThrow('Erro na exclusão');
  });
});
