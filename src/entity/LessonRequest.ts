import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './Subject';
import { Student } from './Student';
import { Tutor } from './Tutor';
import { ReasonName } from './enum/ReasonName';
import { StatusName } from './enum/StatusName';

@Entity()
export class LessonRequest {
  @PrimaryGeneratedColumn()
  ClassId: number;

  @Column({
    type: 'simple-array'
  })
  reason: ReasonName[];

  @Column({
    type: 'simple-array'
  })
  preferredDates: string[];

  @ManyToOne(() => Subject, (subject) => subject.lessonRequest)
  subject: Subject;

  @ManyToOne(() => Student, (student) => student.lessonRequests)
  student: Student;

  @ManyToOne(() => Tutor, (tutor) => tutor.lessonRequests)
  tutor: Tutor;

  @Column({
    type: 'enum',
    enum: StatusName,
    default: 'pendente'
  })
  status: StatusName;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true
  })
  additionalInfo: string;
}
