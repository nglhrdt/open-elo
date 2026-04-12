import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post
} from "routing-controllers";
import { Service } from "typedi";
import { UserDTO } from "../dtos";
import { CreateLeagueDTO } from "../dtos/league/create-league.dto";
import { LeagueService } from "../services/league.service";

@Service()
@JsonController("/leagues")
export class LeagueController {
  constructor(
    private leagueService: LeagueService,
  ) { }

  @Authorized()
  @Get("/")
  async getAllLeagues() {
    return this.leagueService.getAllLeagues();
  }

  @Authorized()
  @Get("/:id")
  async getLeagueById(@Param("id") id: string) {
    return this.leagueService.getLeagueById(id);
  }

  @Authorized()
  @Post("/")
  async createLeague(@CurrentUser() user: UserDTO, @Body() dto: CreateLeagueDTO) {
    return this.leagueService.createLeague({
      dto,
      user,
    });
  }

  @Authorized()
  @Post("/:id/join")
  async joinLeague(@CurrentUser() user: UserDTO, @Param("id") id: string) {
    return this.leagueService.joinLeague({
      leagueId: id,
      user,
    });
  }
}
