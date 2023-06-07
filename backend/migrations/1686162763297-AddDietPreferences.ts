import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDietPreferences1686162763297 implements MigrationInterface {
  name = 'AddDietPreferences1686162763297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
            ADD "vegetarian" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "user"
            ADD "vegan" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "user"
            ADD "glutenFree" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "user"
            ADD "dairyFree" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user"
            DROP COLUMN "dairyFree"`);
    await queryRunner.query(`ALTER TABLE "user"
            DROP COLUMN "glutenFree"`);
    await queryRunner.query(`ALTER TABLE "user"
            DROP COLUMN "vegan"`);
    await queryRunner.query(`ALTER TABLE "user"
            DROP COLUMN "vegetarian"`);
  }
}
