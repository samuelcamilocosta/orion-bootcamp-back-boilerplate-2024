import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { LessonRequest } from './LessonRequest';
import { Tutor } from './Tutor';
import { EnumStatusName } from '../enum/EnumStatusName';

@Entity()
export class LessonRequestTutor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Tutor, (tutor) => tutor.lessonRequestTutors)
  @JoinColumn({ name: 'tutorId' })
  tutor: Tutor;

  @ManyToOne(
    () => LessonRequest,
    (lessonRequest) => lessonRequest.lessonRequestTutors
  )
  @JoinColumn({ name: 'lessonRequestId' })
  lessonRequest: LessonRequest;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  chosenDate: string;

  @Column({
    type: 'enum',
    enum: EnumStatusName,
    default: EnumStatusName.PENDENTE
  })
  status: EnumStatusName;
}
