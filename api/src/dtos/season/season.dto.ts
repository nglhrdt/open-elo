import { IsDate, IsEnum, IsInt, IsISO8601, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";
import { RankingDTO } from "..";
import { LeagueDTO } from "../league";
import { MatchDTO } from "../match/match.dto";
import { GAME } from "../../database/entity/game.entity";

export class SeasonLeagueDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEnum(GAME)
  game: GAME;
}

export class SeasonDTO {
  @IsUUID()
  id: string;

  @ValidateNested()
  league: SeasonLeagueDTO;

  @IsInt()
  @IsPositive()
  seasonNumber: number

  @IsDate()
  @IsISO8601({ strict: true })
  startAt: Date;

  @IsDate()
  @IsISO8601({ strict: true })
  endAt?: Date;
}
