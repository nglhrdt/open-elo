import type { GetMatchesParams } from '@open-elo/shared';
import {
  Authorized,
  Delete,
  Get,
  JsonController,
  Param,
  QueryParams
} from "routing-controllers";
import { Service } from "typedi";
import { MatchService } from "../services/match.service";

@Service()
@JsonController("/matches")
export class MatchController {
  constructor(private matchService: MatchService) { }

  @Get("/")
  @Authorized()
  async getMatches(@QueryParams() params: GetMatchesParams) {
    return this.matchService.getMatches(params);
  }

  @Delete("/:id")
  @Authorized()
  async deleteMatch(@Param("id") id: string) {
    return this.matchService.deleteMatch(id);
  }
}
