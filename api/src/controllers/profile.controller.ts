import { Authorized, CurrentUser, Get, JsonController } from "routing-controllers";
import { Service } from "typedi";
import { UserDTO } from "../dtos";
import { ProfileService } from "../services/profile.service";

@Service()
@JsonController()
export class ProfileController {

  constructor(private profileService: ProfileService) { }

  @Authorized()
  @Get("/me")
  me(@CurrentUser() user: UserDTO) {
    return this.profileService.getMe(user);
  }

  @Authorized()
  @Get("/profile")
  getProfile(@CurrentUser() user: UserDTO) {
    return this.profileService.getProfile(user);
  }
}
