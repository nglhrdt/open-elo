import { Body, Delete, Get, JsonController, Param, Post, Put } from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "../services/user.service";

@Service()
@JsonController("/users")
export class UserController {

  constructor(
    private userService: UserService,
  ) { }

  @Get()
  getAll() {
    return this.userService.getAllUsers();
  }

  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Post()
  post(@Body() user: { username: string, password: string, email: string }) {
    return this.userService.createUser({ email: user.email, username: user.username, passwordHash: user.password });
  }

  @Put('/:id')
  put(@Param('id') id: number, @Body() user: any) {
    return 'Updating a user...';
  }

  @Delete('/:id')
  remove(@Param('id') id: number) {
    return 'Removing user...';
  }
}
