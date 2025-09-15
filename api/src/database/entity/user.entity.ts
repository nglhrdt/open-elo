import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LeagueEntity } from "./league.entity";
import { PlayerEntity } from "./player.entity";
import { RankingEntity } from "./ranking.entity";

export type Role = "user" | "admin" | "guest";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  username: string

  @Column({ unique: true, nullable: true })
  email: string

  @Column({ nullable: true })
  passwordHash: string

  @Column({ enum: ["user", "admin", "guest"], nullable: false, default: "guest" })
  role: Role

  @OneToMany(() => LeagueEntity, league => league.owner, { lazy: true })
  leaguesOwned: LeagueEntity[]

  @OneToMany(() => PlayerEntity, player => player.user, { lazy: true })
  players: PlayerEntity[]

  @OneToMany(() => RankingEntity, ranking => ranking.user, { lazy: true })
  rankings: RankingEntity[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
