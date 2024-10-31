import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { LevelName } from '../entity/enum/LevelName';

export class CreateEducationLevelTable1730156513928
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'education_level',
        columns: [
          {
            name: 'educationId',
            type: 'int',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'levelType',
            type: 'enum',
            enum: Object.values(LevelName),
            isNullable: false
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('education_level');
  }
}
