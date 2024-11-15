import { Request, Response } from 'express';
import { LessonRequestController } from '../../controller/LessonRequestController';
import { DeleteLessonRequestService } from '../../service/DeleteLessonRequestService';

jest.mock('../../service/DeleteLessonRequestService');

describe('LessonRequestController - DeleteById', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: LessonRequestController;
  let deleteLessonRequestService: jest.Mocked<DeleteLessonRequestService>;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };
    controller = new LessonRequestController();
    deleteLessonRequestService =
      new DeleteLessonRequestService() as jest.Mocked<DeleteLessonRequestService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if classId is invalid', async () => {
    req.params.id = 'invalid';

    await controller.DeleteById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Parâmetro inválido' });
  });

  it('should return 204 if deletion is successful', async () => {
    req.params.id = '1';
    deleteLessonRequestService.deleteLessonRequestById.mockResolvedValueOnce(
      undefined
    );

    await controller.DeleteById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('should return 500 if lesson request is not found', async () => {
    req.params.id = '1';
    deleteLessonRequestService.deleteLessonRequestById.mockResolvedValueOnce(
      new Error('Not found')
    );

    await controller.DeleteById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erro interno no servidor'
    });
  });

  it('should return 500 if there is a server error', async () => {
    req.params.id = '1';
    deleteLessonRequestService.deleteLessonRequestById.mockRejectedValueOnce(
      new Error('Server error')
    );

    await controller.DeleteById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erro interno no servidor'
    });
  });
});
