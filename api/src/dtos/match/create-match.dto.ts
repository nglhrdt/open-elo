import { IsEnum, IsString, IsUUID, ValidateNested } from "class-validator";
import { TEAM } from "../../database/entity/player.entity";
import { CreateMatchData } from "@open-elo/shared";

export class CreateMatchPlayerDTO  {
  @IsUUID()
  id!: string;

  @IsEnum(TEAM)
  team!: TEAM;
}

export class CreateMatchDTO implements CreateMatchData {
  @IsUUID()
  seasonId!: string;
  @IsString()
  score!: string;
  @ValidateNested({ each: true })
  players!: CreateMatchPlayerDTO[];
}
