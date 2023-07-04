import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImages1688496202555 implements MigrationInterface {
  name = 'AddImages1688496202555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "image"
                                 (
                                     "id"      SERIAL  NOT NULL,
                                     "ownerId" integer NOT NULL,
                                     CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id")
                                 )`);
    await queryRunner.query(`ALTER TABLE "recipe"
            ADD "imageId" integer`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a4cd5d06d1f0424fd46359cf09" ON "recipe" ("imageId") WHERE "imageId" IS NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "image"
            ADD CONSTRAINT "FK_132fcc8d44e719a21ac7a372c33" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "recipe"
            ADD CONSTRAINT "FK_009cee1c550ac9f44dd36dce05a" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipe"
            DROP CONSTRAINT "FK_009cee1c550ac9f44dd36dce05a"`);
    await queryRunner.query(`ALTER TABLE "image"
            DROP CONSTRAINT "FK_132fcc8d44e719a21ac7a372c33"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a4cd5d06d1f0424fd46359cf09"`,
    );
    await queryRunner.query(`ALTER TABLE "recipe"
            DROP COLUMN "imageId"`);
    await queryRunner.query(`DROP TABLE "image"`);
  }
}
