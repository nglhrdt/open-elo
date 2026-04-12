import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { LeagueEntity } from "./league.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class MemberEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => LeagueEntity, league => league.members)
  league: LeagueEntity;

  @ManyToOne(() => UserEntity, user => user.leagues)
  user: UserEntity;
}
