import { Service } from "typedi";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { GameEntity } from "../database/entity/game.entity";
import { Role, UserEntity } from "../database/entity/user.entity";

@Service()
export class UserService {
  private repository = AppDataSource.getRepository(UserEntity);
  private gameRepository = AppDataSource.getRepository(GameEntity);

  getAllUsers(options: FindManyOptions<UserEntity> = {}) {
    return this.repository.find(options);
  }

  createUser(user: { username: string; email?: string | null; passwordHash?: string | null; role: Role }) {
    const role = user.role;
    const username = user.username?.trim();
    let email = user.email?.trim().toLowerCase() || null;
    let passwordHash = user.passwordHash ?? null;

    if (!username) throw new Error("Username is required");

    if (role === "guest") {
      // Force guest fields to null (ignore supplied values)
      email = null;
      passwordHash = null;
    } else {
      if (!email) throw new Error("Email is required");
      if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Invalid email");
      if (!passwordHash) throw new Error("Password is required");
    }

    return this.repository.manager.transaction(async (mgr) => {
      const repo = mgr.getRepository(UserEntity);

      // Always enforce unique username
      if (await repo.exists({ where: { username } })) {
        throw new Error("Username already in use");
      }

      // Only check email uniqueness if present (non-guest)
      if (email && await repo.exists({ where: { email } })) {
        throw new Error("Email already in use");
      }

      try {
        const entity = repo.create({
          ...user,
          username,
          email: email ?? null,
          passwordHash: passwordHash ?? null,
        });
        return await repo.save(entity);
      } catch (e: any) {
        if (e?.code === "23505") {
          throw new Error("Email or username already in use");
        }
        throw e;
      }
    });
  }

  getUserById(id: string) {
    return this.repository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.repository.findOneBy({ email: email?.trim().toLowerCase() });
  }

  findByUsername(username: string) {
    return this.repository.findOneBy({ username: username?.trim() });
  }

  getUserGames(userId: string, count: number) {
    return this.gameRepository
      .createQueryBuilder("game")
      // join used only to filter games by membership
      .innerJoin("game.players", "pFilter")
      .innerJoin("pFilter.user", "pUser", "pUser.id = :userId", { userId })
      // joins used to load full relations
      .leftJoinAndSelect("game.players", "players")
      .leftJoinAndSelect("players.user", "playerUser")
      .leftJoinAndSelect("game.league", "league")
      .orderBy("game.createdAt", "DESC")
      .take(count || 10)
      .getMany();
  }
}
