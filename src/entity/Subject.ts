import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { LessonRequest } from './LessonRequest';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  subjectId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  subjectName: string;

  @OneToMany(() => LessonRequest, (LessonRequest) => LessonRequest.subject)
  lessonRequest: LessonRequest[];
}
