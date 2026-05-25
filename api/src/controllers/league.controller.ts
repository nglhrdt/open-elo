import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Param,
  Post,
  QueryParams
} from "routing-controllers";
import { Service } from "typedi";
import { UserDTO } from "../dtos";
import { CreateLeagueDTO } from "../dtos/league/create-league.dto";
import { LeagueService } from "../services/league.service";
import { GetLeaguesParams } from "@open-elo/shared";
import { MemberService } from "../services/member.service";

@Service()
@JsonController("/leagues")
export class LeagueController {
  constructor(
    private leagueService: LeagueService,
    private memberService: MemberService,
  ) { }

  @Authorized()
  @Get("/")
  async getAllLeagues(@QueryParams() params: GetLeaguesParams) {
    return this.leagueService.getAllLeagues(params);
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

  @Authorized()
  @Get("/:id/members")
  async getLeagueMembers(@Param("id") id: string) {
    return this.memberService.getLeagueMembers(id);
  }

  @Authorized()
  @Post("/:id/guests")
  async createGuestUser(@Param("id") id: string, @Body() body: { username: string }) {
    return this.memberService.createGuestUser(id, body.username);
  }
}
