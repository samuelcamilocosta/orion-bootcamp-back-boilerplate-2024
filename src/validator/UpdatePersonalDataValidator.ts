import { Request, Response, NextFunction } from 'express';
import { EnumErrorMessages } from '../enum/EnumErrorMessages';

export const UpdatePersonalDataValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { expertise, projectReason } = req.body;

  if (expertise && expertise.length > 50) {
    return res
      .status(400)
      .json({ message: EnumErrorMessages.EXPERTISE_LENGTH_EXCEEDED });
  }

  if (projectReason && projectReason.length > 200) {
    return res.status(400).json({
      message: EnumErrorMessages.PROJECT_REASON_LENGTH_EXCEEDED
    });
  }

  next();
};
