import { GetSeasonsParams } from "@open-elo/shared";
import {
  Authorized,
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  QueryParams
} from "routing-controllers";
import { Service } from "typedi";
import { CreateMatchDTO } from "../dtos";
import { MatchService } from "../services/match.service";
import { SeasonService } from "../services/season.service";

@Service()
@JsonController("/seasons")
export class SeasonController {
  constructor(
    private seasonService: SeasonService,
    private matchService: MatchService,
  ) { }

  @Authorized()
  @Get("/")
  async getSeasons(@QueryParams() params: GetSeasonsParams) {
    return this.seasonService.getSeasons(params.leagueId);
  }

  @Authorized()
  @Get("/:id")
  async getSeasonById(@Param("id") id: string) {
    return this.seasonService.getSeasonById(id);
  }

  @Authorized()
  @Put("/:id/set-end")
  async setSeasonEnd(@Param("id") id: string, @Body() body: { endAt?: Date }) {
    return this.seasonService.setSeasonEnd(id, body.endAt);
  }

  @Authorized()
  @Get("/:id/rankings")
  async getSeasonRankings(@Param("id") id: string) {
    return this.seasonService.getSeasonRankings(id);
  }

  @Authorized()
  @Post("/:id/matches")
  async createSeasonMatch(@Param("id") id: string, @Body() matchData: CreateMatchDTO) {
    return this.matchService.createMatch(id, matchData);
  }

  @Authorized()
  @Get("/:id/matches")
  async getSeasonMatches(@Param("id") id: string, @QueryParam("count") count?: number) {
    return this.seasonService.getSeasonMatches(id, count);
  }

  @Authorized()
  @Get("/:id/elo-chart")
  async getSeasonEloChart(@Param("id") id: string) {
    return this.seasonService.getSeasonEloChart(id);
  }

  @Post("/stop-seasons")
  async stopSeasons() {
    return this.seasonService.stopSeasons();
  }
}
