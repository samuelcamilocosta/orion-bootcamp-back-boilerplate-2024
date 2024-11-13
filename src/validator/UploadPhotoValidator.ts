import { Request, Response, NextFunction } from 'express';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';

export const UploadPhotoValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;

  if (!id || typeof id !== 'number') {
    return res
      .status(400)
      .json({ message: EnumErrorMessages.TUTOR_ID_REQUIRED });
  }

  if (!req.file) {
    return res.status(400).json({
      message: EnumErrorMessages.PHOTO_REQUIRED
    });
  }

  if (req.file.mimetype !== 'image/jpeg') {
    return res.status(400).json({
      message: EnumErrorMessages.INVALID_FILE_TYPE
    });
  }

  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({
      message: EnumErrorMessages.FILE_TOO_LARGE
    });
  }

  next();
};
