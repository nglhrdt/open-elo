import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RankingEntity } from "./ranking.entity";

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

  @OneToMany(() => RankingEntity, ranking => ranking.league, { lazy: true })
  rankings: RankingEntity[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
