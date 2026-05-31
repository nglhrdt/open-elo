import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAvatarUrlToUser1780207543363 implements MigrationInterface {
    name = 'AddAvatarUrlToUser1780207543363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "avatarUrl" character varying`);
        await queryRunner.query(`ALTER TYPE "public"."winner_enum" RENAME TO "winner_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."match_entity_winner_enum" AS ENUM('HOME', 'AWAY', 'DRAW')`);
        await queryRunner.query(`ALTER TABLE "match_entity" ALTER COLUMN "winner" TYPE "public"."match_entity_winner_enum" USING "winner"::"text"::"public"."match_entity_winner_enum"`);
        await queryRunner.query(`DROP TYPE "public"."winner_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."winner_enum_old" AS ENUM('HOME', 'AWAY', 'DRAW')`);
        await queryRunner.query(`ALTER TABLE "match_entity" ALTER COLUMN "winner" TYPE "public"."winner_enum_old" USING "winner"::"text"::"public"."winner_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."match_entity_winner_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."winner_enum_old" RENAME TO "winner_enum"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "avatarUrl"`);
    }

}
