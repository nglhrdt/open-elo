import { Authorized, Body, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { AuthService } from "../services/auth.service";

@Service()
@JsonController()
export class AuthController {

  constructor(
    private service: AuthService,
  ) { }

  @Post('/login')
  login(@Body() credentials: { user: string, password: string }) {
    const { user, password } = credentials;
    if (!user || !password) {
      throw new Error("Missing credentials");
    }
    return this.service.login(credentials.user, credentials.password);
  }

  @Post('/login/token')
  loginWithToken(@Body() data: { token: string }) {
    if (!data.token) {
      throw new Error("Missing token");
    }
    return this.service.loginWithToken(data.token);
  }

  @Post('/register')
  register(@Body() user: { username: string, email: string, password: string }) {
    return this.service.register(user);
  }

  @Post('/logout')
  @Authorized()
  logout() {
    return { message: "Logged out" };
  }
}
