import { IsDate, IsEnum, IsInt, IsString, IsUUID, Validate, ValidateNested } from 'class-validator';
import { GAME } from '../../database/entity/game.entity';

export class LeagueUserDTO {
  @IsUUID()
  id: string;

  @IsString()
  username: string;
}

export class LeagueSeasonDTO {
  @IsUUID()
  id: string;

  @IsInt()
  seasonNumber: number;

  @IsDate()
  startAt: Date;

  @IsDate()
  endAt?: Date;
}

export class LeagueDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEnum(GAME)
  game: GAME;

  @ValidateNested()
  owner: LeagueUserDTO;

  @ValidateNested()
  currentSeason: LeagueSeasonDTO;

  @ValidateNested()
  seasons: LeagueSeasonDTO[];

  @ValidateNested({ each: true })
  members: LeagueUserDTO[];
}
