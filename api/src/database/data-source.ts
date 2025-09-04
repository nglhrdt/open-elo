import { DataSource } from "typeorm"
import { GameEntity } from "./entity/game.entity"
import { LeagueEntity } from "./entity/league.entity"
import { PlayerEntity } from "./entity/player.entity"
import { RankingEntity } from "./entity/ranking.entity"
import { UserEntity } from "./entity/user.entity"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "postgres",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "elo",
  synchronize: true,
  logging: true,
  entities: [GameEntity, LeagueEntity, PlayerEntity, RankingEntity, UserEntity],
  migrations: [],
  subscribers: [],
})
