import { Request, Response } from 'express';
import { TutorController } from '../controller/TutorController';
import { MysqlDataSource } from '../config/database';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';
import { EnumSuccessMessages } from 'enum/EnumSuccessMessages';

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
      expertise: 'Matemática',
      projectReason: 'I love teaching',
      subject: [1, 2]
    };

    const mockTutor = {
      id: 1,
      username: 'testeTutor2',
      fullName: 'testeTutor',
      photoUrl: null,
      birthDate: '2001-03-19',
      expertise: 'Biologia',
      projectReason: 'I love studying',
      educationLevels: [
        { educationId: 2, levelType: 'Médio' },
        { educationId: 3, levelType: 'Pré-Vestibular' }
      ],
      subjects: [1, 2]
    };

    const mockFoundSubjects = [
      { subjectId: 1, subjectName: 'Biologia' },
      { subjectId: 2, subjectName: 'Sociologia' }
    ];

    MysqlDataSource.getRepository = jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockTutor),
      find: jest.fn().mockResolvedValue(mockFoundSubjects),
      save: jest.fn().mockResolvedValue({ ...mockTutor, ...req.body }),
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockTutor)
      })
    });

    await updatePersonalData(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: EnumSuccessMessages.TUTOR_UPDATED
      })
    );
  });

  it('should return 404 if tutor is not found', async () => {
    req.body = { id: 999 };

    MysqlDataSource.getRepository = jest.fn().mockReturnValue({
      createQueryBuilder: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      })
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
