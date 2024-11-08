import { Request, Response, NextFunction } from 'express';

export const UploadPhotoValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;
  console.log(id);
  if (!id) {
    return res
      .status(400)
      .json({ message: 'ID do tutor inválido ou não informado' });
  }

  if (!req.file || req.file.mimetype !== 'image/jpeg') {
    return res.status(400).json({ message: 'A imagem deve ser do tipo jpg' });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ message: 'A imagem deve ter no máximo 5MB' });
  }

  console.log('Entrei');
  next();
};
