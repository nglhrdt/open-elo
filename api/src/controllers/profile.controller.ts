import { Authorized, CurrentUser, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { UserDTO } from "../dtos";
import { ProfileService } from "../services/profile.service";

@Service()
@JsonController("/me")
export class ProfileController {

  constructor(private profileService: ProfileService) { }

  @Authorized()
  @Get("/")
  me(@CurrentUser() user: UserDTO) {
    return this.profileService.getMe(user);
  }
}
