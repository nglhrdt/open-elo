import { IsEnum, IsISO8601, IsString, IsUUID, ValidateNested } from "class-validator";
import { PlayerDTO } from "../player";
import { Match } from "@open-elo/shared";
import { WINNER } from "../../database/entity/match.entity";

export class MatchDTO implements Match {
  @IsUUID()
  id!: string;

  @IsEnum(WINNER)
  winningTeam!: WINNER;

  @IsString()
  score!: string;

  @ValidateNested({ each: true })
  players!: PlayerDTO[];

  @IsUUID()
  seasonId!: string;

  @IsUUID()
  leagueId!: string;

  @IsISO8601()
  createdAt!: Date;

  @IsISO8601()
  updatedAt!: Date;
}
