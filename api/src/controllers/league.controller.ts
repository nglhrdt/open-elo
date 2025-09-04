import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post } from "routing-controllers";
import { Service } from "typedi";
import { UserEntity } from "../database/entity/user.entity";
import { LeagueService } from "../services/league.service";
import { RankingService } from "../services/ranking.service";

@Service()
@JsonController("/leagues")
export class LeagueController {
  constructor(
    private leagueService: LeagueService,
    private rankingService: RankingService,
  ) {
  }

  @Get("/")
  async getAllLeagues() {
    return this.leagueService.getAllLeagues();
  }

  @Get("/:id")
  async getLeagueById(@Param('id') id: string) {
    return this.leagueService.getLeagueById(id);
  }

  @Post("/")
  async createLeague(@Body() body: { name: string, type: string }) {
    return this.leagueService.createLeague({ ...body });
  }

  @Authorized()
  @Post("/:leagueId/join")
  async joinLeague(@Param('leagueId') leagueId: string, @CurrentUser() user: UserEntity) {
    return this.rankingService.joinUserToLeague(leagueId, user.id);
  }

  @Post("/:leagueId/join/:userId")
  async addPlayerToLeague(@Param('leagueId') leagueId: string, @Param('userId') userId: string) {
    return this.rankingService.joinUserToLeague(leagueId, userId);
  }

  @Get("/:leagueId/users")
  async getUsersByLeagueId(@Param('leagueId') leagueId: string) {
    return this.leagueService.getUsersByLeagueId(leagueId);
  }
}
