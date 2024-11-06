import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertEducationLevels1730156513929 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('education_level');
    if (tableExists) {
      await queryRunner.query(`
                INSERT INTO education_level (levelType) VALUES
                ('fundamental'),
                ('medio'),
                ('pre-vestibular');
            `);
    } else {
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DELETE FROM education_level
            WHERE id IN (0, 2, 3);
        `);
  }
}
