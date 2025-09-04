import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Action } from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "./user.service";

interface JwtPayload {
  sub: string;
  roles?: string[];
}

@Service()
export class AuthService {
  private secret = process.env.JWT_SECRET || "dev_secret";
  private expiresIn = 1000 * 60; // 1 minute for demo purposes

  constructor(private userService: UserService) { }

  async login(username: string, password: string) {
    const userNameUser = await this.userService.findByUsername(username);
    const emailUser = await this.userService.findByEmail(username);
    const user = userNameUser || emailUser;

    if (!user) throw new Error("Invalid credentials");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("Invalid credentials");
    const token = this.sign(user.id, []); // Assuming roles are empty for simplicity
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }

  async register(data: { username: string; email: string; password: string }) {
    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await this.userService.createUser({ username: data.username, email: data.email, passwordHash });
    const token = this.sign(user.id, []); // Assuming roles are empty for simplicity
    return { token, user: { id: user.id, username: user.username, email: user.email } };
  }

  sign(userId: string, roles: string[]) {
    return jwt.sign({ roles } as Omit<JwtPayload, "sub">, this.secret, { subject: userId, expiresIn: this.expiresIn });
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
    return user ? { id: user.id, username: user.username, email: user.email } : null;
  }
}
