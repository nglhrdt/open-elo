import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GameEntity } from "./game.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ["home", "away"], nullable: false })
  team: "home" | "away";

  @ManyToOne(() => GameEntity, game => game.players)
  game: GameEntity;

  @ManyToOne(() => UserEntity, user => user.players)
  user: UserEntity;
}
