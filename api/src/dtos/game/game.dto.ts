import { IsEnum, IsString, IsUUID } from "class-validator";
import { GAME } from "../../database/entity/game.entity";

export class GameDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEnum(GAME)
  game: GAME;
}
