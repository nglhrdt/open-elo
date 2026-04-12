import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Action } from 'routing-controllers';
import { Service } from 'typedi';
import { LeagueEntity } from '../database/entity/league.entity';
import { ROLE, UserEntity } from '../database/entity/user.entity';
import { CredentialsDTO, RegisterDTO } from '../dtos';
import { FavoriteLeagueDTO, UserDTO } from '../dtos/user/user.dto';
import { UserService } from './user.service';

interface JwtPayload {
  sub: string;
  role: ROLE;
  leagueId?: string; // For token-based guest logins
  iat: number;
  exp: number;
}

@Service()
export class AuthService {
  private secret = process.env.JWT_SECRET || 'dev_secret';
  private expiresIn = 1000 * 60 * 60 * 24 * 30; // 30 days

  constructor(
    private userService: UserService,
  ) { }

  async login({ email, password }: CredentialsDTO) {
    const user = await this.userService.getUserByEmail(email);

    if (!user) throw new Error('Invalid credentials');
    if (user.role === 'guest') throw new Error('Guest users cannot log in');
    if (!user.passwordHash) throw new Error('User has no password set');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error('Invalid credentials');

    return this.createAuthToken(user);
  }

  async register({ username, email, password }: RegisterDTO) {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.userService.createUser({
      username,
      email,
      passwordHash,
      role: ROLE.USER,
    });

    return this.createAuthToken(user);
  }

  sign(userId: string, role: ROLE,) {
    const payload: Omit<JwtPayload, 'sub' | 'iat' | 'exp'> = { role };
    return jwt.sign(payload, this.secret, {
      subject: userId,
      expiresIn: this.expiresIn,
    });
  }

  parseToken(authHeader?: string) {
    if (!authHeader) return null;
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    try {
      return jwt.verify(token, this.secret) as jwt.JwtPayload;
    } catch {
      return null;
    }
  }

  isAuthenticated(action: Action, roles: ROLE[]) {
    const token = this.parseToken(action.request.headers.authorization);
    if (!token) return false;
    (action.request as any).userId = token.sub;
    (action.request as any).userRole = (token as any).role;
    (action.request as any).leagueId = (token as any).leagueId;
    (action.request as any).roles = (token as any).roles || [];
    if (roles.length) {
      return roles.some((r) => (token as any).roles?.includes(r));
    }
    return true;
  }

  async getCurrentUser(action: Action): Promise<UserDTO | null> {
    const userId = (action.request as any).userId;
    if (!userId) return null;
    const user = await this.userService.getUserById(userId);
    return user ? this.toDTO(user) : null;
  }

  private createAuthToken(user: UserEntity) {
    const token = this.sign(user.id, user.role);
    return { token, user: this.toDTO(user) };
  }

  private toDTO(user: UserEntity): UserDTO {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      favoriteLeague: user.favoriteLeague ? this.toLeagueDTO(user.favoriteLeague) : undefined,
    };
  }

  private toLeagueDTO(league: LeagueEntity): FavoriteLeagueDTO {
    return {
      id: league.id,
      name: league.name,
      game: league.game.game,
      season: {
        id: league.currentSeason.id,
        seasonNumber: league.currentSeason.seasonNumber,
      },
    };
  }
}
