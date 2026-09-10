import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1789068168087 implements MigrationInterface {
    name = 'InitialSchema1789068168087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "ranking_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "elo" integer NOT NULL DEFAULT '1000', "seasonId" uuid, "userId" uuid, CONSTRAINT "PK_9e8dc4a71a2ac59500f55544cbd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "season_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seasonNumber" integer NOT NULL, "startAt" TIMESTAMP NOT NULL, "endAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "leagueId" uuid, CONSTRAINT "PK_6e8253e1e5f335d0413d350b472" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ec3fd338a3dc280fa8db953c89" ON "season_entity" ("seasonNumber", "leagueId") `);
        await queryRunner.query(`CREATE TYPE "public"."match_entity_winner_enum" AS ENUM('HOME', 'AWAY', 'DRAW')`);
        await queryRunner.query(`CREATE TABLE "match_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "home_score" integer NOT NULL, "away_score" integer NOT NULL, "winner" "public"."match_entity_winner_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "seasonId" uuid NOT NULL, CONSTRAINT "PK_4378e339adc7bd7c80f938afd9c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."player_entity_team_enum" AS ENUM('HOME', 'AWAY')`);
        await queryRunner.query(`CREATE TABLE "player_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "team" "public"."player_entity_team_enum" NOT NULL, "eloBefore" integer, "eloAfter" integer, "matchId" uuid, "userId" uuid, CONSTRAINT "PK_db4a0b692e54fd8ee0247f40d0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_entity_role_enum" AS ENUM('user', 'admin', 'guest')`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying, "passwordHash" character varying, "role" "public"."user_entity_role_enum" NOT NULL DEFAULT 'guest', "avatarUrl" character varying, "deleted" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "favoriteLeagueId" uuid, CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "REL_39b8a17fc955fdf295f0de4d6d" UNIQUE ("favoriteLeagueId"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "member_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "leagueId" uuid, "userId" uuid, CONSTRAINT "PK_74fbc25d2e0bf8e3884ac9354b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "league_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid, "gameId" uuid, "currentSeasonId" uuid, CONSTRAINT "REL_aecdcc8821c6fb9568fc119cfc" UNIQUE ("currentSeasonId"), CONSTRAINT "PK_f7ce5fb7ab6cdceaf5840f0a6ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."game_entity_game_enum" AS ENUM('TABLE_SOCCER')`);
        await queryRunner.query(`CREATE TABLE "game_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "game" "public"."game_entity_game_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f9f8d5bc97d6a9fcb2058fbdfef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "ranking_entity" ADD CONSTRAINT "FK_40d9d1409d99a184a5bdb9a17b1" FOREIGN KEY ("seasonId") REFERENCES "season_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ranking_entity" ADD CONSTRAINT "FK_2305bfbeea03a517c5888dac7ff" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "season_entity" ADD CONSTRAINT "FK_a0300b0ae855dda3c6dc41f9905" FOREIGN KEY ("leagueId") REFERENCES "league_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match_entity" ADD CONSTRAINT "FK_995c025327f1063846999266e7d" FOREIGN KEY ("seasonId") REFERENCES "season_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_entity" ADD CONSTRAINT "FK_281553679f99cbaaeb1987c9c0a" FOREIGN KEY ("matchId") REFERENCES "match_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_entity" ADD CONSTRAINT "FK_f6755dd16cb867957e56aeb55c7" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "FK_39b8a17fc955fdf295f0de4d6d8" FOREIGN KEY ("favoriteLeagueId") REFERENCES "league_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_entity" ADD CONSTRAINT "FK_af4f8297e884392d8db2803aa98" FOREIGN KEY ("leagueId") REFERENCES "league_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_entity" ADD CONSTRAINT "FK_b4349fa6345252b670a7ab0f032" FOREIGN KEY ("userId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "league_entity" ADD CONSTRAINT "FK_c642ebabf31f3c3daae009f5459" FOREIGN KEY ("ownerId") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "league_entity" ADD CONSTRAINT "FK_df9029dfd765e56b331f9bdb9c9" FOREIGN KEY ("gameId") REFERENCES "game_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "league_entity" ADD CONSTRAINT "FK_aecdcc8821c6fb9568fc119cfcb" FOREIGN KEY ("currentSeasonId") REFERENCES "season_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "league_entity" DROP CONSTRAINT "FK_aecdcc8821c6fb9568fc119cfcb"`);
        await queryRunner.query(`ALTER TABLE "league_entity" DROP CONSTRAINT "FK_df9029dfd765e56b331f9bdb9c9"`);
        await queryRunner.query(`ALTER TABLE "league_entity" DROP CONSTRAINT "FK_c642ebabf31f3c3daae009f5459"`);
        await queryRunner.query(`ALTER TABLE "member_entity" DROP CONSTRAINT "FK_b4349fa6345252b670a7ab0f032"`);
        await queryRunner.query(`ALTER TABLE "member_entity" DROP CONSTRAINT "FK_af4f8297e884392d8db2803aa98"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "FK_39b8a17fc955fdf295f0de4d6d8"`);
        await queryRunner.query(`ALTER TABLE "player_entity" DROP CONSTRAINT "FK_f6755dd16cb867957e56aeb55c7"`);
        await queryRunner.query(`ALTER TABLE "player_entity" DROP CONSTRAINT "FK_281553679f99cbaaeb1987c9c0a"`);
        await queryRunner.query(`ALTER TABLE "match_entity" DROP CONSTRAINT "FK_995c025327f1063846999266e7d"`);
        await queryRunner.query(`ALTER TABLE "season_entity" DROP CONSTRAINT "FK_a0300b0ae855dda3c6dc41f9905"`);
        await queryRunner.query(`ALTER TABLE "ranking_entity" DROP CONSTRAINT "FK_2305bfbeea03a517c5888dac7ff"`);
        await queryRunner.query(`ALTER TABLE "ranking_entity" DROP CONSTRAINT "FK_40d9d1409d99a184a5bdb9a17b1"`);
        await queryRunner.query(`DROP TABLE "game_entity"`);
        await queryRunner.query(`DROP TYPE "public"."game_entity_game_enum"`);
        await queryRunner.query(`DROP TABLE "league_entity"`);
        await queryRunner.query(`DROP TABLE "member_entity"`);
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TYPE "public"."user_entity_role_enum"`);
        await queryRunner.query(`DROP TABLE "player_entity"`);
        await queryRunner.query(`DROP TYPE "public"."player_entity_team_enum"`);
        await queryRunner.query(`DROP TABLE "match_entity"`);
        await queryRunner.query(`DROP TYPE "public"."match_entity_winner_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ec3fd338a3dc280fa8db953c89"`);
        await queryRunner.query(`DROP TABLE "season_entity"`);
        await queryRunner.query(`DROP TABLE "ranking_entity"`);
    }

}
