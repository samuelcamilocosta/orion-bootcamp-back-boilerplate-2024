import { Request, Response, NextFunction } from 'express';

export const UpdatePersonalDataValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { expertise, projectReason } = req.body;

  if (expertise && expertise.length > 50) {
    return res
      .status(400)
      .json({ message: 'Quantidade inválida de caracteres' });
  }

  if (projectReason && projectReason.length > 200) {
    return res.status(400).json({
      message: 'Quantidade inválida de caracteres'
    });
  }

  next();
};
