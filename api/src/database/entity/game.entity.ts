import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PlayerEntity } from "./player.entity";

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  score: string;

  @OneToMany(() => PlayerEntity, player => player.game, { eager: true, cascade: true })
  players: PlayerEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
