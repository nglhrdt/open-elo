import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlayerEntity, TEAM } from "./player.entity";
import { SeasonEntity } from "./season.entity";

export enum WINNER {
  HOME = 'HOME',
  AWAY = 'AWAY',
  DRAW = 'DRAW',
}

@Entity()
export class MatchEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: 'home_score' })
  homeScore: number;

  @Column({ name: 'away_score' })
  awayScore: number;

  @Column()
  winner: WINNER;

  @OneToMany(() => PlayerEntity, player => player.match, { eager: true, cascade: true })
  players: PlayerEntity[];

  @ManyToOne(() => SeasonEntity, season => season.matches, {
    nullable: false,
    eager: false,
  })
  season: SeasonEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
