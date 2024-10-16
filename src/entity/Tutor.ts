import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Subject } from './Subject';
import { EducationLevel } from './EducationLevel';
import { User } from './User';

@Entity()
export class Tutor extends User {

    @Column({ type: 'varchar', length: 11, unique: true,  nullable: false })
    cpf: string;

    @ManyToMany(() => Subject, { cascade: true})
    @JoinTable({
        name: 'tutor_subjects_subject',
        joinColumn: {
            name: 'tutorId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'subjectId',
            referencedColumnName: 'subjectId',
        }
    })
    subjects: Subject[];

    @ManyToMany(() => EducationLevel, { cascade: true})
    @JoinTable({
        name: 'tutor_education_levels',
        joinColumn: {
            name: 'tutorId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'educationLevelId',
            referencedColumnName: 'educationId',
        }
    })
    educationLevels: EducationLevel[];
}