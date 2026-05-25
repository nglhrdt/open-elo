import { IsEmail, IsEnum, IsInt, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";
import { GAME } from "../../database/entity/game.entity";
import { ROLE } from "../../database/entity/user.entity";
import { User } from "@open-elo/shared";

export class FavoriteLeagueSeasonDTO {
  @IsUUID()
  id!: string;

  @IsInt()
  @IsPositive()
  seasonNumber!: number;
}

export class FavoriteLeagueDTO {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @IsEnum(GAME)
  game!: GAME;

  @ValidateNested()
  season!: FavoriteLeagueSeasonDTO;
}

export class UserDTO implements User {
  @IsUUID()
  id!: string;

  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsEnum(ROLE)
  role!: ROLE

  @ValidateNested()
  favoriteLeague!: FavoriteLeagueDTO;
};
