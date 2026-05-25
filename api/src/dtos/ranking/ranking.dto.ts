import { Ranking } from "@open-elo/shared";
import { IsInt, IsString, IsUUID } from "class-validator";

export class RankingDTO implements Ranking {
  @IsUUID()
  id!: string;

  @IsInt()
  elo!: number;

  @IsInt()
  position!: number;

  @IsUUID()
  leagueId!: string;

  @IsUUID()
  userId!: string;

  @IsString()
  username!: string;
}
