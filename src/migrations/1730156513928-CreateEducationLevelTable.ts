import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { EnumLevelName } from '../enum/EnumLevelName';

export class CreateEducationLevelTable1730156513928
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const tableExists = await queryRunner.hasTable('education_level');
    if (!tableExists) {
      await queryRunner.createTable(
        new Table({
          name: 'education_level',
          columns: [
            {
              name: 'educationId',
              type: 'int',
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment'
            },
            {
              name: 'levelType',
              type: 'enum',
              enum: Object.values(EnumLevelName),
              isNullable: false
            }
          ]
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('education_level');
  }
}
