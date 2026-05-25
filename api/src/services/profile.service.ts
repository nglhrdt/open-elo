import { Profile, User } from "@open-elo/shared";
import { Service } from "typedi";
import { UserDTO } from "../dtos";

@Service()
export class ProfileService {
  getMe(user: UserDTO): User {
    return user;
  }

  getProfile(user: UserDTO): Profile {
    return user;
  }
}
