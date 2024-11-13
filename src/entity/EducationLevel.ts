import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EnumLevelName } from '../enum/enum/EnumLevelName';

@Entity()
export class EducationLevel {
  @PrimaryGeneratedColumn()
  educationId: number;

  @Column({ type: 'enum', enum: EnumLevelName, nullable: false })
  levelType: EnumLevelName;
}
