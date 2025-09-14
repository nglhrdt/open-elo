import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, QueryParam } from "routing-controllers";
import { Service } from "typedi";
import { LEAGUE_TYPE } from "../database/entity/league.entity";
import { UserEntity } from "../database/entity/user.entity";
import { User } from "../services/auth.service";
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
  @Authorized()
  async createLeague(@CurrentUser() user: User, @Body() body: { name: string, type: LEAGUE_TYPE }) {
    return this.leagueService.createLeague({ name: body.name, type: body.type, ownerId: user.id });
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

  @Get("/:leagueId/games")
  async getGamesByLeagueId(@Param('leagueId') leagueId: string, @QueryParam('count') count: number) {
    return this.leagueService.getGamesByLeagueId(leagueId, count);
  }
}
