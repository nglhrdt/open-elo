import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Action } from "routing-controllers";
import { Service } from "typedi";
import { Role, UserEntity } from "../database/entity/user.entity";
import { TokenService } from "./token.service";
import { UserService } from "./user.service";

interface JwtPayload {
  sub: string;
  role: Role;
  leagueId?: string; // For token-based guest logins
  iat: number;
  exp: number;
}

export type User = { id: string, username: string, email: string, role: Role }

@Service()
export class AuthService {
  private secret = process.env.JWT_SECRET || "dev_secret";
  private expiresIn = 1000 * 60; // 1 minute for demo purposes

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) { }

  async login(username: string, password: string) {
    const userNameUser = await this.userService.findByUsername(username);
    const emailUser = await this.userService.findByEmail(username);
    const user = userNameUser || emailUser;

    if (!user) throw new Error("Invalid credentials");
    if (user.role === "guest") throw new Error("Guest users cannot log in");
    if (!user.passwordHash) throw new Error("User has no password set");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("Invalid credentials");

    return this.createTokenAndReturn(user);
  }

  async register(data: { username: string; email: string; password: string }) {
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await this.userService.createUser({ username: data.username, email: data.email, passwordHash, role: "user" });

    return this.createTokenAndReturn(user);
  }

  async loginWithToken(tokenString: string) {
    const accessToken = await this.tokenService.getTokenByString(tokenString);

    if (!accessToken) {
      throw new Error("Invalid or expired token");
    }

    // Create a guest user for this token login
    const timestamp = Date.now();
    const guestUsername = `guest_${accessToken.league.name}_${timestamp}`.substring(0, 50);
    
    const guestUser = await this.userService.createUser({
      username: guestUsername,
      email: null,
      passwordHash: null,
      role: "guest"
    });

    // Don't create a ranking for token-based guests
    // They can view and create games but won't appear in league rankings

    return this.createTokenAndReturn(guestUser, accessToken.league.id);
  }

  sign(userId: string, role: Role, leagueId?: string) {
    const payload: Omit<JwtPayload, "sub" | "iat" | "exp"> = { role };
    if (leagueId) {
      payload.leagueId = leagueId;
    }
    return jwt.sign(payload, this.secret, { subject: userId, expiresIn: this.expiresIn });
  }

  parseToken(authHeader?: string) {
    if (!authHeader) return null;
    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) return null;
    try {
      return jwt.verify(token, this.secret) as jwt.JwtPayload;
    } catch {
      return null;
    }
  }

  isAuthenticated(action: Action, roles: string[]) {
    const payload = this.parseToken(action.request.headers.authorization);
    if (!payload) return false;
    (action.request as any).userId = payload.sub;
    (action.request as any).userRole = (payload as any).role;
    (action.request as any).leagueId = (payload as any).leagueId;
    (action.request as any).roles = (payload as any).roles || [];
    if (roles.length) {
      return roles.some(r => (payload as any).roles?.includes(r));
    }
    return true;
  }

  async getCurrentUser(action: Action) {
    const userId = (action.request as any).userId;
    if (!userId) return null;
    const user = await this.userService.getUserById(userId);
    return user ? this.formatUser(user) : null;
  }

  private createTokenAndReturn(user: UserEntity, leagueId?: string) {
    const token = this.sign(user.id, user.role, leagueId);
    return { token, user: this.formatUser(user) };
  }

  private formatUser(user: UserEntity): User {
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }
}
