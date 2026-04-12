import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LeagueEntity } from "./league.entity";
import { MemberEntity } from "./member.entity";
import { PlayerEntity } from "./player.entity";
import { RankingEntity } from "./ranking.entity";

export enum ROLE {
  USER = "user",
  ADMIN = "admin",
  GUEST = "guest"
}

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

  @OneToOne(() => LeagueEntity, { nullable: true })
  @JoinColumn()
  favoriteLeague: LeagueEntity

  @Column({ type: 'enum', enum: ROLE, nullable: false, default: ROLE.GUEST })
  role: ROLE

  @OneToMany(() => MemberEntity, member => member.user, { lazy: true })
  leagues: MemberEntity[]

  @OneToMany(() => LeagueEntity, league => league.owner, { lazy: true })
  leaguesOwned: LeagueEntity[]

  @OneToMany(() => PlayerEntity, player => player.user, { lazy: true })
  players: PlayerEntity[]

  @OneToMany(() => RankingEntity, ranking => ranking.user, { lazy: true })
  rankings: RankingEntity[]

  @Column({ default: false })
  deleted: boolean

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
