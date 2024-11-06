import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertSubjects1730416827233 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('subject');
    if (tableExists) {
      await queryRunner.query(`
        INSERT INTO subject (subjectName) VALUES 
        ('Biologia'),
        ('Sociologia'),
        ('Gramática'),
        ('História'),
        ('Filosofia'),
        ('Literatura'),
        ('Geografia'),
        ('Física'),
        ('Redação'),
        ('Inglês'),
        ('Química'),
        ('Matemática');
        `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM subject WHERE subjectName IN ('Biologia', 'Sociologia', 'Gramática', 'História', 'Filosofia', 'Literatura', 'Geografia', 'Física', 'Redação', 'Inglês', 'Química', 'Matemática');
    `);
  }
}
