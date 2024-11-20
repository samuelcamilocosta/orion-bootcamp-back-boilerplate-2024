import { Request, Response } from 'express';
import { LessonRequestController } from '../../controller/LessonRequestController';
import { LessonRequestService } from '../../service/LessonRequestService';

jest.mock('../../service/LessonRequestService');

describe('LessonRequestController - DeleteById', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let controller: LessonRequestController;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };
    controller = new LessonRequestController();
    jest.clearAllMocks();
  });

  it('deve retornar 400 se o parâmetro id for inválido', async () => {
    req.params.id = 'invalid';

    await controller.DeleteById(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Parâmetro inválido' });
  });

  it('deve retornar 204 se a exclusão for bem-sucedida', async () => {
    req.params.id = '1';

    jest
      .spyOn(LessonRequestService, 'deleteLessonRequestById')
      .mockResolvedValueOnce();

    await controller.DeleteById(req as Request, res as Response);

    expect(LessonRequestService.deleteLessonRequestById).toHaveBeenCalledWith(
      1
    );
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('deve retornar 500 se ocorrer um erro durante a exclusão', async () => {
    req.params.id = '1';

    jest
      .spyOn(LessonRequestService, 'deleteLessonRequestById')
      .mockRejectedValueOnce(new Error('Erro interno do servidor'));

    await controller.DeleteById(req as Request, res as Response);

    expect(LessonRequestService.deleteLessonRequestById).toHaveBeenCalledWith(
      1
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erro interno do servidor.'
    });
  });
});
