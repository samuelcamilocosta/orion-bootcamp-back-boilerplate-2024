import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Subject } from './Subject';
import { EducationLevel } from './EducationLevel';
import { User } from './User';
import { LessonRequest } from './LessonRequest';

@Entity()
export class Tutor extends User {
  @Column({ type: 'varchar', length: 11, unique: true, nullable: false })
  cpf: string;

  @ManyToMany(() => Subject, { cascade: true })
  @JoinTable({
    name: 'tutor_subjects_subject',
    joinColumn: {
      name: 'tutorId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'subjectId',
      referencedColumnName: 'subjectId'
    }
  })
  subjects: Subject[];

  @ManyToMany(() => EducationLevel, { cascade: true })
  @JoinTable({
    name: 'tutor_education_levels',
    joinColumn: {
      name: 'tutorId',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'educationLevelId',
      referencedColumnName: 'educationId'
    }
  })
  educationLevels: EducationLevel[];

  @Column({ type: 'varchar', length: 50, nullable: true })
  expertise: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  projectReason: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  photoUrl: string;

  @OneToMany(() => LessonRequest, (lessonRequest) => lessonRequest.tutor)
  lessonRequests: LessonRequest[];
}
