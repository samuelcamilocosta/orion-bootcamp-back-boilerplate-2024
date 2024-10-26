import { Entity, ObjectIdColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../Users';

/**
 * Entidade Student, refletindo as informações complementares solicitadas
 * Vinculada ao usuário por meio do campo userId.
 */
@Entity('students')
export class Student {
    @ObjectIdColumn()
    id: string;

    @ManyToOne(() => User, (user) => user.id)
    userId: string;

    @Column()
    birthDate: Date;

    @Column()
    educationLevel: string;

    @Column()
    schoolType: string;

    @Column('simple-array')
    subjectsOfInterest: string[];

    @Column()
    phoneNumber: string;
}
