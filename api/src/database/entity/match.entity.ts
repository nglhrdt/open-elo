import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlayerEntity } from "./player.entity";
import { SeasonEntity } from "./season.entity";

@Entity()
export class MatchEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  score: string;

  @OneToMany(() => PlayerEntity, player => player.match, { eager: true, cascade: true })
  players: PlayerEntity[];

  @ManyToOne(() => SeasonEntity, season => season.matches, {
    nullable: false,
    eager: false,
  })
  season: SeasonEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
