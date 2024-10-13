import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Subject } from './Subject';

@Entity()
export class Student {
    @PrimaryGeneratedColumn()
    studentId: number;

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

    @Column({ type: 'varchar', length: 255, nullable: false })
    salt: string;

    @ManyToMany(() => Subject, { cascade: true})
    @JoinTable({
        name: 'student_subjects_subject',
        joinColumn: {
            name: 'studentId',
            referencedColumnName: 'studentId',
        },
        inverseJoinColumn: {
            name: 'subjectId',
            referencedColumnName: 'subjectId',
        }
    })
    subjects: Subject[];

    
}