import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedTableSoccerGame1789068422156 implements MigrationInterface {
    name = 'SeedTableSoccerGame1789068422156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "game_entity" ("game")
            SELECT 'TABLE_SOCCER'
            WHERE NOT EXISTS (SELECT 1 FROM "game_entity" WHERE "game" = 'TABLE_SOCCER')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "game_entity" WHERE "game" = 'TABLE_SOCCER'`);
    }

}
