import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LeagueEntity } from "./league.entity";
import { PlayerEntity } from "./player.entity";

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  score: string;

  @Column({ default: 1 })
  seasonNumber: number;

  @OneToMany(() => PlayerEntity, player => player.game, { eager: true, cascade: true })
  players: PlayerEntity[];

  @ManyToOne(() => LeagueEntity, league => league.games, {
    nullable: false,
    eager: false,
  })
  league: LeagueEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
