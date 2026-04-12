import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SeasonEntity } from "./season.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class RankingEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 1000 })
  elo: number;

  @ManyToOne(() => SeasonEntity, season => season.rankings)
  season: SeasonEntity;

  @ManyToOne(() => UserEntity, user => user.rankings)
  user: UserEntity;
}
