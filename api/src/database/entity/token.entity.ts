import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LeagueEntity } from "./league.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class TokenEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ nullable: false })
  expiresAt: Date;

  @Column({ nullable: false, default: false })
  revoked: boolean;

  @ManyToOne(() => UserEntity, {
    eager: true,
    nullable: false
  })
  owner: UserEntity;

  @ManyToOne(() => LeagueEntity, {
    eager: true,
    nullable: false
  })
  league: LeagueEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
