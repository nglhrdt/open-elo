import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LeagueEntity } from "./league.entity";
import { PlayerEntity } from "./player.entity";

export enum GAME {
  TABLE_SOCCER = 'TABLE_SOCCER'
}

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'enum', enum: GAME , nullable: false })
  game: GAME;

  @OneToMany(() => LeagueEntity, league => league.game, { lazy: true })
  leagues: LeagueEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
