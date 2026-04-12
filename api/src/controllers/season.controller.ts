import {
  Authorized,
  Body,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam
} from "routing-controllers";
import { Service } from "typedi";
import { CreateMatchDTO, CreateSeasonDTO } from "../dtos";
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
  @Get("/:id")
  async getSeasonById(@Param("id") id: string) {
    return this.seasonService.getSeasonById(id);
  }

  @Authorized()
  @Post("/")
  async createSeason(@Body() dto: CreateSeasonDTO) {
    return this.seasonService.createSeason(dto);
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

  @Post("/stop-seasons")
  async stopSeasons() {
    return this.seasonService.stopSeasons();
  }
}
