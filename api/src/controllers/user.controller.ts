import { Authorized, Body, Delete, Get, JsonController, Param, Post, Put, QueryParam } from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "../services/user.service";

@Service()
@JsonController("/users")
export class UserController {

  constructor(
    private userService: UserService,
  ) { }

  @Authorized()
  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Authorized()
  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Authorized()
  @Post()
  post(@Body() user: { username: string, password: string, email: string }) {
    return this.userService.createUser({ email: user.email, username: user.username, passwordHash: user.password });
  }

  @Authorized()
  @Put('/:id')
  put(@Param('id') id: number, @Body() user: any) {
    return 'Updating a user...';
  }

  @Authorized()
  @Delete('/:id')
  remove(@Param('id') id: number) {
    return 'Removing user...';
  }

  @Authorized()
  @Get("/:id/games")
  getUserGames(@Param("id") id: string, @QueryParam("count") count: number) {
    return this.userService.getUserGames(id, count);
  }
}
