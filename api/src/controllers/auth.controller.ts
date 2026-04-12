import { Authorized, Body, JsonController, Post } from 'routing-controllers';
import { Service } from 'typedi';
import { CredentialsDTO, RegisterDTO } from '../dtos';
import { AuthService } from '../services/auth.service';

@Service()
@JsonController()
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('/login')
  login(@Body() credentials: CredentialsDTO) {
    return this.service.login(credentials);
  }

  @Post('/register')
  register(@Body() user: RegisterDTO) {
    return this.service.register(user);
  }

  @Post('/logout')
  @Authorized()
  logout() {
    return { message: 'Logged out' };
  }
}
