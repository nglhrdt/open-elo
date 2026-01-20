import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeagueEntity } from "./league.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class RankingEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 1000 })
  elo: number;

  @Column({ default: 1 })
  seasonNumber: number;

  @ManyToOne(() => LeagueEntity, league => league.rankings)
  league: LeagueEntity;

  @ManyToOne(() => UserEntity, user => user.rankings)
  user: UserEntity;
}
