import { Authorized, Body, CurrentUser, Delete, Get, JsonController, Param, Post } from "routing-controllers";
import { Service } from "typedi";
import { User } from "../services/auth.service";
import { TokenService } from "../services/token.service";

@Service()
@JsonController("/tokens")
export class TokenController {
  constructor(
    private tokenService: TokenService,
  ) {}

  @Authorized()
  @Get("/")
  async getTokens(@CurrentUser() user: User) {
    // For now, return all tokens owned by the current user
    // In the future, admins could see all tokens
    return this.tokenService.getTokensByOwnerId(user.id);
  }

  @Authorized()
  @Post("/")
  async createToken(
    @CurrentUser() user: User,
    @Body() body: { leagueId: string, validityDays: number }
  ) {
    return this.tokenService.createToken({
      leagueId: body.leagueId,
      ownerId: user.id,
      validityDays: body.validityDays,
    });
  }

  @Authorized()
  @Delete("/:id")
  async revokeToken(@Param('id') id: string, @CurrentUser() user: User) {
    return this.tokenService.revokeToken(id, user.id);
  }
}
