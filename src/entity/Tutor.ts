import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Subject } from './Subject';
import { EducationLevel } from './EducationLevel';

@Entity()
export class Tutor {
    @PrimaryGeneratedColumn()
    tutorId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    fullName: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    username: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    birthDate: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 11, unique: true,  nullable: false })
    cpf: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    salt: string;

    @ManyToMany(() => Subject, { cascade: true})
    @JoinTable({
        name: 'tutor_subjects_subject',
        joinColumn: {
            name: 'tutorId',
            referencedColumnName: 'tutorId',
        },
        inverseJoinColumn: {
            name: 'subjectId',
            referencedColumnName: 'subjectId',
        }
    })
    subjects: Subject[];

    @ManyToMany(() => EducationLevel, { cascade: true})
    @JoinTable({
        name: 'tutor_education_levels_education_level',
        joinColumn: {
            name: 'tutorId',
            referencedColumnName: 'tutorId',
        },
        inverseJoinColumn: {
            name: 'educationLevelId',
            referencedColumnName: 'educationId',
        }
    })
    educationLevels: EducationLevel[];
}