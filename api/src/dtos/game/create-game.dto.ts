import { IsEnum, IsString } from "class-validator";
import { GAME } from "../../database/entity/game.entity";

export class CreateGameDTO {
  @IsString()
  name: string;

  @IsEnum(GAME)
  game: GAME;
}
