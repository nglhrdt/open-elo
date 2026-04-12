import { IsISO8601, IsString, IsUUID, ValidateNested } from "class-validator";
import { PlayerDTO } from "../player";
import { SeasonDTO } from "../season";

export class MatchDTO {
  @IsUUID()
  id: string;

  @IsString()
  score: string;

  @ValidateNested({ each: true })
  players: PlayerDTO[];

  @IsUUID()
  seasonId: string;

  @IsUUID()
  leagueId: string;

  @IsISO8601()
  createdAt: string;

  @IsISO8601()
  updatedAt: string;

}
