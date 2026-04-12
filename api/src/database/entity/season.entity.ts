import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { LeagueEntity } from './league.entity';
import { MatchEntity } from './match.entity';
import { RankingEntity } from './ranking.entity';

@Entity()
@Index(['seasonNumber', 'league'], { unique: true })
export class SeasonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LeagueEntity, (league) => league.seasons)
  league: LeagueEntity;

  @OneToMany(() => MatchEntity, (match) => match.season)
  matches: MatchEntity[];

  @OneToMany(() => RankingEntity, (ranking) => ranking.season)
  rankings: RankingEntity[];

  @Column({ nullable: false })
  seasonNumber: number;

  @Column({ nullable: false })
  startAt: Date;

  @Column({ nullable: true })
  endAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
