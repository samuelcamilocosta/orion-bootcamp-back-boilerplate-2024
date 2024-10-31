import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateSubjectTable1730416775023 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subject',
        columns: [
          {
            name: 'subjectId',
            type: 'int',
            isPrimary: true,
            isGenerated: true
          },
          {
            name: 'subjectName',
            type: 'varchar',
            length: '255',
            isNullable: false
          }
        ]
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('subject');
  }
}
