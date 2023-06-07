import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSwipeTable1686160681491 implements MigrationInterface {
  name = 'CreateSwipeTable1686160681491';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "swipe"
                                 (
                                     "recipeId"  character varying        NOT NULL,
                                     "isLiked"   boolean                  NOT NULL,
                                     "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                     "userId"    integer,
                                     CONSTRAINT "PK_e47835dbe9333f2adfcb932de42" PRIMARY KEY ("recipeId")
                                 )`);
    await queryRunner.query(`ALTER TABLE "swipe"
            ADD CONSTRAINT "FK_68cab0b70b0bb4cd0139225cca4" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "swipe"
            DROP CONSTRAINT "FK_68cab0b70b0bb4cd0139225cca4"`);
    await queryRunner.query(`DROP TABLE "swipe"`);
  }
}
