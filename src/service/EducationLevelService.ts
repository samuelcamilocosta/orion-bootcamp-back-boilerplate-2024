import { EnumLevelName } from '../entity/enum/EnumLevelName';
import { EducationLevel } from '../entity/EducationLevel';
import { EducationLevelRepository } from '../repository/EducationLevelRepository';

export class EducationLevelService {
  static async createEducationLevel(levelType: EnumLevelName) {
    if (!levelType) {
      throw new Error('Nível de ensino é obrigatório.');
    }

    if (!(levelType in EnumLevelName)) {
      throw new Error('Nível de ensino inválido.');
    }

    const educationLevel = new EducationLevel();
    educationLevel.levelType = levelType;
    return await EducationLevelRepository.saveEducationLevel(educationLevel);
  }
}
