import { Service } from "typedi";
import { UserDTO } from "../dtos";

@Service()
export class ProfileService {

  getMe(user: UserDTO) {
    return user;
  }

}
