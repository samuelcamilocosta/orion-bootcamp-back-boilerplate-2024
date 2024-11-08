import { Request, Response, NextFunction } from 'express';
import { UpdatePersonalDataValidator } from '../validator/UpdatePersonalDataValidator';

describe('UpdatePersonalDataValidator', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() if validation passes', () => {
    req.body = {
      expertise: 'Mathematics',
      projectReason: 'I love teaching'
    };

    UpdatePersonalDataValidator(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if expertise exceeds character limit', () => {
    req.body = {
      expertise: 'a'.repeat(51),
      projectReason: 'Valid reason'
    };

    UpdatePersonalDataValidator(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Quantidade inválida de caracteres'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if projectReason exceeds character limit', () => {
    req.body = {
      expertise: 'Valid expertise',
      projectReason: 'a'.repeat(201)
    };

    UpdatePersonalDataValidator(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Quantidade inválida de caracteres'
    });
    expect(next).not.toHaveBeenCalled();
  });
});
