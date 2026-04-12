import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameEntity } from './game.entity';
import { MemberEntity } from './member.entity';
import { SeasonEntity } from './season.entity';
import { UserEntity } from './user.entity';

@Entity()
export class LeagueEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.leaguesOwned)
  owner: UserEntity;

  @ManyToOne(() => GameEntity, (game) => game.leagues)
  game: GameEntity;

  @OneToMany(() => MemberEntity, (member) => member.league)
  members: MemberEntity[];

  @OneToOne(() => SeasonEntity, {nullable: true})
  @JoinColumn()
  currentSeason: SeasonEntity;

  @OneToMany(() => SeasonEntity, (season) => season.league)
  seasons: SeasonEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
