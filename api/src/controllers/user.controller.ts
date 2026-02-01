import {
  Authorized,
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  Req,
} from "routing-controllers";
import { Service } from "typedi";
import { Role } from "../database/entity/user.entity";
import { UserService } from "../services/user.service";

@Service()
@JsonController("/users")
export class UserController {
  constructor(private userService: UserService) {}

  @Authorized()
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Authorized()
  @Get("/:id")
  getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }

  @Authorized()
  @Post()
  createUser(
    @Body()
    user: {
      username: string;
      password: string;
      email: string;
      role: Role;
    },
  ) {
    return this.userService.createUser({
      email: user.email,
      username: user.username,
      passwordHash: user.password,
      role: user.role,
    });
  }

  @Authorized()
  @Put("/:id")
  updateUser(@Param("id") id: string, @Body() body: { username: string }, @Req() request: any) {
    const currentUserId = request.userId;
    if (currentUserId !== id) {
      throw new Error("You can only update your own profile");
    }
    return this.userService.updateUser(id, { username: body.username });
  }

  @Authorized()
  @Delete("/:id")
  deleteUser(@Param("id") id: string) {
    return this.userService.deleteUser(id);
  }

  @Authorized()
  @Get("/:id/games")
  getUserGames(
    @Param("id") id: string,
    @QueryParam("count") count?: number,
    @QueryParam("leagueId") leagueId?: string,
    @QueryParam("skip") skip?: number,
    @QueryParam("take") take?: number,
    @QueryParam("seasonNumber") seasonNumber?: number,
  ) {
    return this.userService.getUserGames(id, { count, leagueId, skip, take, seasonNumber });
  }

  @Post("/:id/convert-to-registered")
  convertGuestToRegistered(
    @Param("id") userId: string,
    @Body() body: { email: string; password: string },
  ) {
    return this.userService.convertGuestToRegistered(
      userId,
      body.email,
      body.password,
    );
  }
}
