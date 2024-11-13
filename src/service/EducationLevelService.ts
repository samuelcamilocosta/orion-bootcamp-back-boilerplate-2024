import { EnumLevelName } from '../entity/enum/EnumLevelName';
import { EducationLevel } from '../entity/EducationLevel';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';
import { AppError } from '../error/AppError';
import { EnumErrorMessages } from '../error/enum/EnumErrorMessages';
import { handleError } from '../utils/ErrorHandler';

export class EducationLevelService {
  static async createEducationLevel(levelType: EnumLevelName) {
    if (!levelType) {
      throw new AppError(EnumErrorMessages.EDUCATION_LEVEL_NOT_FOUND, 400);
    }

    if (!(levelType in EnumLevelName)) {
      throw new AppError(EnumErrorMessages.EDUCATION_LEVEL_INVALID, 400);
    }

    const educationLevel = new EducationLevel();
    educationLevel.levelType = levelType;
    return await EducationLevelRepository.saveEducationLevel(educationLevel);
  }

  static async getAllEducationLevels() {
    try {
      const educationLevels =
        await EducationLevelRepository.findAllEducationLevels();
      if (!educationLevels) {
        throw new AppError(EnumErrorMessages.EDUCATION_LEVEL_NOT_FOUND, 404);
      }
      return educationLevels;
    } catch (error) {
      const { statusCode, message } = handleError(error);
      throw new AppError(message, statusCode);
    }
  }
}
