import { Authorized, CurrentUser, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController("/me")
export class ProfileController {
  @Authorized()
  @Get("/")
  me(@CurrentUser() user: any) {
    return user;
  }
}
