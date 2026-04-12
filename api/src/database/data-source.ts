import { DataSource } from 'typeorm';
import { GameEntity } from './entity/game.entity';
import { LeagueEntity } from './entity/league.entity';
import { MatchEntity } from './entity/match.entity';
import { MemberEntity } from './entity/member.entity';
import { PlayerEntity } from './entity/player.entity';
import { RankingEntity } from './entity/ranking.entity';
import { SeasonEntity } from './entity/season.entity';
import { UserEntity } from './entity/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  synchronize: false,
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
  migrations: [],
  subscribers: [],
});
