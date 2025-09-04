import { Authorized, CurrentUser, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { RankingService } from "../services/ranking.service";

@Service()
@JsonController("/rankings")
export class RankingController {
  constructor(private rankingService: RankingService) { }

  @Get("/")
  @Authorized()
  getRankings(@CurrentUser() user: { id: string }) {
    return this.rankingService.getUserRankings(user.id);
  }
}
