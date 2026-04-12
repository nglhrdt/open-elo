import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchEntity } from "./match.entity";
import { UserEntity } from "./user.entity";

export enum TEAM {
  HOME = 'HOME',
  AWAY = 'AWAY',
}

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'enum', enum: TEAM, nullable: false })
  team: TEAM;

  @Column({ type: "int", nullable: true })
  eloBefore: number | null;

  @Column({ type: "int", nullable: true })
  eloAfter: number | null;

  @ManyToOne(() => MatchEntity, match => match.players)
  match: MatchEntity;

  @ManyToOne(() => UserEntity, user => user.players)
  user: UserEntity;
}
