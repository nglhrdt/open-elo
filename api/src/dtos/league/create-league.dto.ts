import { IsEnum, IsString } from "class-validator";
import { GAME } from "../../database/entity/game.entity";

export class CreateLeagueDTO {
  @IsString()
  name: string;

  @IsEnum(GAME)
  game: GAME;
}
