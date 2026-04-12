import { IsInt, IsString, IsUUID, ValidateNested } from "class-validator";
import { SeasonDTO } from "../season";
import { UserDTO } from "../user";

export class RankingUserDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}

export class RankingDTO {
  @IsInt()
  elo: number;

  @ValidateNested()
  user: RankingUserDTO;
}
