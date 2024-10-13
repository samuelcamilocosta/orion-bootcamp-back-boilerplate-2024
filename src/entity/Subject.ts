import { Entity, ManyToMany, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    subjectId: number;

    @Column({ type: 'varchar', length: 255, nullable: false })
    subjectName: string;
}