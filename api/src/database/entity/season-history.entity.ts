import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeagueEntity } from "./league.entity";

export interface SeasonRanking {
  userId: string;
  username: string;
  elo: number;
  position: number;
}

@Entity()
export class SeasonHistoryEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  seasonNumber: number;

  @Column()
  endDate: Date;

  @Column("simple-json")
  rankings: SeasonRanking[];

  @ManyToOne(() => LeagueEntity, { nullable: false })
  league: LeagueEntity;

  @CreateDateColumn()
  createdAt: Date;
}
