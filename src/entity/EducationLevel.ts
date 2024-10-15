import { Entity, ManyToMany, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class EducationLevel {
  @PrimaryGeneratedColumn()
  educationId: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  levelType: string;
}
