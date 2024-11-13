import { Request, Response } from 'express';
import { TutorController } from '../controller/TutorController';
import { MysqlDataSource } from '../config/database';
import { EnumErrorMessages } from '../error/enum/EnumErrorMessages';

jest.mock('../config/database');
const updatePersonalData = TutorController.prototype.updatePersonalData;

describe('updatePersonalData', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update personal data with valid inputs', async () => {
    req.body = {
      id: 1,
      expertise: 'Mathematics',
      projectReason: 'I love teaching',
      subject: [1, 2]
    };

    const mockTutor = { id: 1, expertise: '', projectReason: '', subjects: [] };
    const mockFoundSubjects = [{ subjectId: 1 }, { subjectId: 2 }];

    MysqlDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockTutor),
      findBy: jest.fn().mockResolvedValue(mockFoundSubjects),
      save: jest.fn().mockResolvedValue({ ...mockTutor, ...req.body })
    });

    await updatePersonalData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Tutor atualizado com sucesso!'
      })
    );
  });

  it('should return 404 if tutor is not found', async () => {
    req.body = { id: 999 };

    MysqlDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null)
    });

    await updatePersonalData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: EnumErrorMessages.TUTOR_NOT_FOUND
    });
  });

  it('should return 500 if there is a server error', async () => {
    req.body = { id: 1, expertise: 'Math', projectReason: 'I love teaching' };

    MysqlDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      })
    });

    await updatePersonalData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: EnumErrorMessages.INTERNAL_SERVER
    });
  });
});
