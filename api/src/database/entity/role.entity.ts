import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

export enum RoleName {
  USER = "user",
  ADMIN = "admin",
}

@Entity()
export class RoleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: RoleName, unique: true })
  name: RoleName;

  @ManyToMany(() => UserEntity, user => user.roles, { lazy: true })
  users: UserEntity[];
}
