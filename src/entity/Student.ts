import { Entity, ManyToMany, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { Subject } from './Subject';
import { EducationLevel } from './EducationLevel';
import { User } from './User';

@Entity()
export class Student extends User {
    
    @ManyToOne(() => EducationLevel, { nullable: false })
    @JoinColumn({ name: 'educationId' }) 
    educationLevel: EducationLevel;
    
    @ManyToMany(() => Subject, { cascade: true })
    @JoinTable({
        name: 'student_subjects',
        joinColumn: {
            name: 'studentId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'subjectId',
            referencedColumnName: 'subjectId',
        }
    })
    subjects: Subject[];

    
    
}
