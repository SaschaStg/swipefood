import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTables1683148265321 implements MigrationInterface {
  name = 'CreateUserTables1683148265321';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "user"
                                 (
                                     "id"          SERIAL            NOT NULL,
                                     "displayName" character varying NOT NULL,
                                     CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                                 )`);
    await queryRunner.query(`CREATE TABLE "user_login"
                                 (
                                     "userId"   integer           NOT NULL,
                                     "username" character varying NOT NULL,
                                     "password" character varying NOT NULL,
                                     CONSTRAINT "UQ_0023df6d24599eb897e7424bd6a" UNIQUE ("username"),
                                     CONSTRAINT "PK_161aa6cbc1ef997b64c43182820" PRIMARY KEY ("userId")
                                 )`);
    await queryRunner.query(`ALTER TABLE "user_login"
            ADD CONSTRAINT "FK_161aa6cbc1ef997b64c43182820" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_login"
            DROP CONSTRAINT "FK_161aa6cbc1ef997b64c43182820"`);
    await queryRunner.query(`DROP TABLE "user_login"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
