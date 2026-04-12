import { IsISO8601, IsUUID } from "class-validator";
import { IsNull } from "typeorm";

export class CreateSeasonDTO {
  @IsUUID()
  leagueId: string;

  @IsISO8601({strict: true})
  startAt: Date;

  @IsISO8601({strict: true})
  endAt?: Date;
}
