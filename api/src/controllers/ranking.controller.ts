import { Authorized, CurrentUser, Get, JsonController, Param, QueryParam } from "routing-controllers";
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

  @Get("/user/:userId")
  @Authorized()
  getRankingsByUserId(@Param("userId") userId: string) {
    return this.rankingService.getUserRankings(userId);
  }

  @Get("/league/:leagueId")
  @Authorized()
  getRankingsByLeague(@Param("leagueId") leagueId: string, @QueryParam("seasonNumber") seasonNumber: number) {
    return this.rankingService.getLeagueRankings(leagueId, seasonNumber);
  }
}
