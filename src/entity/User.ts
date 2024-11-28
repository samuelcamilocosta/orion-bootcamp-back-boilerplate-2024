import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    nullable: false,
    select: false
  })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  salt: string;

  @Column({ type: 'varchar', length: 255, nullable: false, select: false })
  fullName: string;

  @Column({ type: 'date', nullable: false, select: false })
  birthDate: Date;
}
