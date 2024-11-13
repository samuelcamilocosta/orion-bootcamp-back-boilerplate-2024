import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../error/enum/EnumErrorMessages';

export const handleError = (error: Error) => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message
    };
  }
  return {
    statusCode: 500,
    message: EnumErrorMessages.INTERNAL_SERVER
  };
};
