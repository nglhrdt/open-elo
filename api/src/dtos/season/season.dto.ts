import { Season } from "@open-elo/shared";
import { IsBoolean, IsDate, IsEnum, IsInt, IsISO8601, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";
import { GAME } from "../../database/entity/game.entity";

export class SeasonLeagueDTO {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsEnum(GAME)
  game!: GAME;
}

export class SeasonDTO implements Season {
  @IsBoolean()
  isCurrentSeason!: boolean;

  @IsUUID()
  id!: string;

  @ValidateNested()
  league!: SeasonLeagueDTO;

  @IsInt()
  @IsPositive()
  seasonNumber!: number

  @IsDate()
  @IsISO8601({ strict: true })
  startAt!: Date;

  @IsDate()
  @IsISO8601({ strict: true })
  endAt?: Date;
}
