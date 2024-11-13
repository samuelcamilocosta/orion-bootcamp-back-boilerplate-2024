import { LessonRequestRepository } from '../repository/LessonRequestRepository';

export class DeleteLessonRequestService {
  private lessonRequestRepository: LessonRequestRepository;

  constructor() {
    this.lessonRequestRepository = new LessonRequestRepository();
  }

  async execute(classId: number) {
    const lessonRequest =
      await this.lessonRequestRepository.findByClassId(classId);
    if (!lessonRequest) {
      return new Error('Pedido de aula não existe');
    }

    await this.lessonRequestRepository.deleteByClassId(classId);
  }
}
