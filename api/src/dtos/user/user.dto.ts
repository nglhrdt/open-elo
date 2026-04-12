import { IsEmail, IsEnum, IsInt, IsString, IsUUID, ValidateNested } from "class-validator";
import { GAME } from "../../database/entity/game.entity";
import { ROLE } from "../../database/entity/user.entity";

export class FavoriteLeagueSeasonDTO {
  @IsUUID()
  id: string;

  @IsInt()
  seasonNumber: number;
}

export class FavoriteLeagueDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEnum(GAME)
  game: GAME;

  @ValidateNested()
  season?: FavoriteLeagueSeasonDTO;
}

export class UserDTO {
  @IsUUID()
  id: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsEnum(ROLE)
  role: ROLE

  @ValidateNested()
  favoriteLeague?: FavoriteLeagueDTO;
};
