import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GameEntity } from "./game.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class PlayerEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ enum: ["home", "away"], nullable: false })
  team: "home" | "away";

  @Column({ type: "int", nullable: true })
  eloBefore: number | null;

  @Column({ type: "int", nullable: true })
  eloAfter: number | null;

  @ManyToOne(() => GameEntity, game => game.players)
  game: GameEntity;

  @ManyToOne(() => UserEntity, user => user.players)
  user: UserEntity;
}
