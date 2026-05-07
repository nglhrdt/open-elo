import type { GetMatchesParams } from '@open-elo/shared';
import {
  Get,
  JsonController,
  QueryParams
} from "routing-controllers";
import { Service } from "typedi";
import { MatchService } from "../services/match.service";

@Service()
@JsonController("/matches")
export class MatchController {
  constructor(private matchService: MatchService) { }

  @Get("/")
  async getMatches(@QueryParams() params: GetMatchesParams) {
    return this.matchService.getMatches(params);
  }
}
