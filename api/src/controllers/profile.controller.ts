import { Authorized, CurrentUser, Get, JsonController, Req } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController("/me")
export class ProfileController {
  @Authorized()
  @Get("/")
  me(@CurrentUser() user: any, @Req() request: any) {
    const leagueId = request.leagueId;
    if (leagueId) {
      return { ...user, leagueId };
    }
    return user;
  }
}
