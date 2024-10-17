import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { LevelName } from './LevelName';

@Entity()
export class EducationLevel {
    @PrimaryGeneratedColumn()
    educationId: number;
 
    @Column({ type: 'enum', enum: LevelName, nullable: false })
    levelType: LevelName;
}
