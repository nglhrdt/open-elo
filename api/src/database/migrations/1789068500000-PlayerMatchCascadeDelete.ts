import { MigrationInterface, QueryRunner } from "typeorm";

export class PlayerMatchCascadeDelete1789068500000 implements MigrationInterface {
    name = 'PlayerMatchCascadeDelete1789068500000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_entity" DROP CONSTRAINT "FK_281553679f99cbaaeb1987c9c0a"`);
        await queryRunner.query(`ALTER TABLE "player_entity" ADD CONSTRAINT "FK_281553679f99cbaaeb1987c9c0a" FOREIGN KEY ("matchId") REFERENCES "match_entity"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player_entity" DROP CONSTRAINT "FK_281553679f99cbaaeb1987c9c0a"`);
        await queryRunner.query(`ALTER TABLE "player_entity" ADD CONSTRAINT "FK_281553679f99cbaaeb1987c9c0a" FOREIGN KEY ("matchId") REFERENCES "match_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
