import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Subject } from './Subject';
import { Student } from './Student';
import { Tutor } from './Tutor';
import { EnumReasonName } from '../enum/EnumReasonName';
import { EnumStatusName } from '../enum/EnumStatusName';

@Entity()
export class LessonRequest {
  @PrimaryGeneratedColumn()
  ClassId: number;

  @Column({
    type: 'simple-array'
  })
  reason: EnumReasonName[];

  @Column({
    type: 'simple-array'
  })
  preferredDates: string[];

  @ManyToOne(() => Subject, (subject) => subject.lessonRequest)
  subject: Subject;

  @ManyToOne(() => Student, (student) => student.lessonRequests)
  student: Student;

  @ManyToMany(() => Tutor, (tutor) => tutor.lessonRequests)
  tutors: Tutor[];

  @Column({
    type: 'enum',
    enum: EnumStatusName,
    default: EnumStatusName.PENDENTE
  })
  status: EnumStatusName;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true
  })
  additionalInfo: string;
}
