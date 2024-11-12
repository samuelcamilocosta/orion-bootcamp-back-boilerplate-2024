import { Request, Response, NextFunction } from 'express';

export const UploadPhotoValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;

  if (!id || typeof id !== 'number') {
    return res
      .status(400)
      .json({ message: 'ID do tutor é obrigatório e deve ser um número.' });
  }

  if (!req.file) {
    return res.status(400).json({
      message: 'Arquivo de foto é obrigatório.'
    });
  }

  if (req.file.mimetype !== 'image/jpeg') {
    return res.status(400).json({
      message: 'A imagem deve ser do tipo jpg.'
    });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({
      message: 'A imagem deve ter no máximo 5MB.'
    });
  }

  next();
};
