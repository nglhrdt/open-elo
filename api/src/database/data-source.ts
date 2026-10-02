import { DataSource } from 'typeorm';
import { GameEntity } from './entity/game.entity';
import { LeagueEntity } from './entity/league.entity';
import { MatchEntity } from './entity/match.entity';
import { MemberEntity } from './entity/member.entity';
import { PlayerEntity } from './entity/player.entity';
import { RankingEntity } from './entity/ranking.entity';
import { SeasonEntity } from './entity/season.entity';
import { UserEntity } from './entity/user.entity';
import { InitialSchema1789068168087 } from './migrations/1789068168087-InitialSchema';
import { SeedTableSoccerGame1789068422156 } from './migrations/1789068422156-SeedTableSoccerGame';
import { PlayerMatchCascadeDelete1789068500000 } from './migrations/1789068500000-PlayerMatchCascadeDelete';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  synchronize: false,
  migrationsRun: true,
  logging: false,
  entities: [
    GameEntity,
    LeagueEntity,
    MatchEntity,
    MemberEntity,
    PlayerEntity,
    RankingEntity,
    SeasonEntity,
    UserEntity,
  ],
  migrations: [
    InitialSchema1789068168087,
    SeedTableSoccerGame1789068422156,
    PlayerMatchCascadeDelete1789068500000,
  ],
  subscribers: [],
});
