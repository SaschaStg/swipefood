import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomRecipes1686773753909 implements MigrationInterface {
  name = 'AddCustomRecipes1686773753909';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "ingredient"
                                 (
                                     "id"       SERIAL            NOT NULL,
                                     "name"     character varying NOT NULL,
                                     "amount"   integer           NOT NULL,
                                     "unit"     character varying NOT NULL,
                                     "recipeId" integer           NOT NULL,
                                     CONSTRAINT "PK_6f1e945604a0b59f56a57570e98" PRIMARY KEY ("id")
                                 )`);
    await queryRunner.query(`CREATE TABLE "recipe"
                                 (
                                     "id"             SERIAL            NOT NULL,
                                     "title"          character varying NOT NULL,
                                     "readyInMinutes" integer           NOT NULL,
                                     "servings"       integer           NOT NULL,
                                     "summary"        character varying NOT NULL,
                                     "instructions"   character varying NOT NULL,
                                     "vegetarian"     boolean           NOT NULL,
                                     "vegan"          boolean           NOT NULL,
                                     "glutenFree"     boolean           NOT NULL,
                                     "dairyFree"      boolean           NOT NULL,
                                     "userId"         integer           NOT NULL,
                                     CONSTRAINT "PK_e365a2fedf57238d970e07825ca" PRIMARY KEY ("id")
                                 )`);
    await queryRunner.query(`ALTER TABLE "ingredient"
            ADD CONSTRAINT "FK_a19a4b507b9e2d1efd2d73b37bc" FOREIGN KEY ("recipeId") REFERENCES "recipe" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "recipe"
            ADD CONSTRAINT "FK_fe30fdc515f6c94d39cd4bbfa76" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "recipe"
            DROP CONSTRAINT "FK_fe30fdc515f6c94d39cd4bbfa76"`);
    await queryRunner.query(`ALTER TABLE "ingredient"
            DROP CONSTRAINT "FK_a19a4b507b9e2d1efd2d73b37bc"`);
    await queryRunner.query(`DROP TABLE "recipe"`);
    await queryRunner.query(`DROP TABLE "ingredient"`);
  }
}
