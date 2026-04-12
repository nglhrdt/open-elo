import { IsEnum, IsString, IsUUID, ValidateNested } from "class-validator";
import { TEAM } from "../../database/entity/player.entity";

export class CreateMatchPlayerDTO {
  @IsUUID()
  id: string;

  @IsEnum(TEAM)
  team: TEAM;
}

export class CreateMatchDTO {
  @IsString()
  score: string;

  @ValidateNested({ each: true })
  players: CreateMatchPlayerDTO[];
}
