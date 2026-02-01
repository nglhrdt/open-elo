import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Put, QueryParam } from "routing-controllers";
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

  @Authorized()
  @Get("/")
  async getAllLeagues() {
    return this.leagueService.getAllLeagues();
  }

  @Authorized()
  @Get("/:id")
  async getLeagueById(@Param('id') id: string) {
    return this.leagueService.getLeagueById(id);
  }

  @Authorized()
  @Post("/")
  async createLeague(@CurrentUser() user: User, @Body() body: { name: string, type: LEAGUE_TYPE }) {
    return this.leagueService.createLeague({ name: body.name, type: body.type, ownerId: user.id });
  }

  @Authorized()
  @Put("/:id")
  async updateLeague(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() body: { seasonEnabled?: boolean, seasonEndDate?: string }
  ) {
    return this.leagueService.updateLeagueSeasonSettings(id, user.id, body);
  }

  @Authorized()
  @Post("/:leagueId/join")
  async joinLeague(@Param('leagueId') leagueId: string, @CurrentUser() user: UserEntity) {
    return this.rankingService.joinUserToLeague(leagueId, user.id);
  }

  @Authorized()
  @Post("/:leagueId/join/:userId")
  async addPlayerToLeague(@Param('leagueId') leagueId: string, @Param('userId') userId: string) {
    return this.rankingService.joinUserToLeague(leagueId, userId);
  }

  @Authorized()
  @Get("/:leagueId/users")
  async getUsersByLeagueId(@Param('leagueId') leagueId: string) {
    return this.leagueService.getUsersByLeagueId(leagueId);
  }

  @Authorized()
  @Get("/:leagueId/games")
  async getGamesByLeagueId(@Param('leagueId') leagueId: string, @QueryParam('count') count: number, @QueryParam('seasonNumber') seasonNumber: number) {
    return this.leagueService.getGamesByLeagueId(leagueId, count, seasonNumber);
  }

  @Authorized()
  @Get("/:leagueId/seasons")
  async getAvailableSeasons(@Param('leagueId') leagueId: string) {
    return this.leagueService.getAvailableSeasons(leagueId);
  }

  @Post("/stop-seasons")
  async stopSeasons() {
    return this.leagueService.processEndedSeasons();
  }
}

