import { Validate, ValidateNested } from "class-validator";
import { SeasonDTO } from "./season.dto";
import { RankingDTO } from "../ranking";

export class SeasonRankingDTO {
  @ValidateNested()
  season: SeasonDTO;

  @ValidateNested({ each: true })
  rankings: RankingDTO[];
}
