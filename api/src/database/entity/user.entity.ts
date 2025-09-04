import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PlayerEntity } from "./player.entity";
import { RankingEntity } from "./ranking.entity";
import { RoleEntity } from "./role.entity";

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  email: string

  @Column()
  passwordHash: string

  @OneToMany(() => PlayerEntity, player => player.user, { lazy: true })
  players: PlayerEntity[]

  @OneToMany(() => RankingEntity, ranking => ranking.user, { lazy: true })
  rankings: RankingEntity[]

  @ManyToMany(() => RoleEntity, role => role.users, { lazy: true })
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" }
  })
  roles: RoleEntity[]
}
