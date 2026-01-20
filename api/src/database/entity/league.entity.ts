import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GameEntity } from "./game.entity";
import { RankingEntity } from "./ranking.entity";
import { UserEntity } from "./user.entity";

export enum LEAGUE_TYPE {
  TABLE_SOCCER = "TABLE_SOCCER",
  INDOOR_SOCCER = "INDOOR_SOCCER",
}

@Entity()
export class LeagueEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ enum: ["TABLE_SOCCER", "INDOOR_SOCCER"], nullable: false })
  type: LEAGUE_TYPE;

  @Column({ default: false })
  seasonEnabled: boolean;

  @Column({ nullable: true })
  seasonEndDate: Date;

  @Column({ default: 1 })
  currentSeasonNumber: number;

  @OneToMany(() => RankingEntity, ranking => ranking.league, { lazy: true })
  rankings: RankingEntity[]

  @OneToMany(() => GameEntity, game => game.league, { lazy: true })
  games: GameEntity[]

  @ManyToOne(() => UserEntity, user => user.leaguesOwned, {
    lazy: true,
    nullable: false,
  })
  owner: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
