import bcrypt from "bcrypt";
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

  createUser(user: {
    username: string;
    email?: string | null;
    passwordHash?: string | null;
    role: Role;
  }) {
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
      if (email && (await repo.exists({ where: { email } }))) {
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

  async getUserGames(
    userId: string,
    options: {
      count?: number;
      leagueId?: string;
      skip?: number;
      take?: number;
      seasonNumber?: number;
    } = {},
  ) {
    const { count, leagueId, skip, take, seasonNumber } = options;
    const query = this.gameRepository
      .createQueryBuilder("game")
      // join used only to filter games by membership
      .innerJoin("game.players", "pFilter")
      .innerJoin("pFilter.user", "pUser", "pUser.id = :userId", { userId })
      // joins used to load full relations
      .leftJoinAndSelect("game.players", "players")
      .leftJoinAndSelect("players.user", "playerUser")
      .leftJoinAndSelect("game.league", "league");

    if (leagueId) {
      query.andWhere("game.leagueId = :leagueId", { leagueId });
    }

    if (seasonNumber !== undefined) {
      query.andWhere("game.seasonNumber = :seasonNumber", { seasonNumber });
    }

    query.orderBy("game.createdAt", "DESC");

    // Get total count before applying pagination
    const total = await query.getCount();

    if (skip !== undefined) {
      query.skip(skip);
    }

    if (take !== undefined) {
      query.take(take);
    } else if (count !== undefined) {
      query.take(count);
    } else {
      query.take(10);
    }

    const data = await query.getMany();

    return { data, total };
  }

  async convertGuestToRegistered(
    userId: string,
    email: string,
    password: string,
  ) {
    const trimmedEmail = email?.trim().toLowerCase();

    if (!trimmedEmail) throw new Error("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) throw new Error("Invalid email");
    if (!password) throw new Error("Password is required");

    return this.repository.manager.transaction(async (mgr) => {
      const repo = mgr.getRepository(UserEntity);

      // Find the user
      const user = await repo.findOneBy({ id: userId });
      if (!user) throw new Error("User not found");

      // Verify the user is a guest
      if (user.role !== "guest") throw new Error("User is not a guest user");

      // Check if email is already in use
      if (await repo.exists({ where: { email: trimmedEmail } })) {
        throw new Error("Email already in use");
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 12);

      // Update the user
      user.email = trimmedEmail;
      user.passwordHash = passwordHash;
      user.role = "user";

      try {
        return await repo.save(user);
      } catch (e: any) {
        if (e?.code === "23505") {
          throw new Error("Email already in use");
        }
        throw e;
      }
    });
  }

  async updateUser(userId: string, data: { username?: string }) {
    const trimmedUsername = data.username?.trim();

    if (!trimmedUsername) throw new Error("Username is required");

    return this.repository.manager.transaction(async (mgr) => {
      const repo = mgr.getRepository(UserEntity);

      // Find the user
      const user = await repo.findOneBy({ id: userId });
      if (!user) throw new Error("User not found");

      // Check if username is already in use by another user
      const existingUser = await repo.findOneBy({ username: trimmedUsername });
      if (existingUser && existingUser.id !== userId) {
        throw new Error("Username already in use");
      }

      // Update the username
      user.username = trimmedUsername;

      try {
        return await repo.save(user);
      } catch (e: any) {
        if (e?.code === "23505") {
          throw new Error("Username already in use");
        }
        throw e;
      }
    });
  }

  async deleteUser(userId: string) {
    return this.repository.manager.transaction(async (mgr) => {
      const userRepo = mgr.getRepository(UserEntity);
      const gameRepo = mgr.getRepository(GameEntity);

      // Find the user
      const user = await userRepo.findOne({
        where: { id: userId },
        relations: ["rankings", "rankings.league"],
      });
      if (!user) throw new Error("User not found");

      // Only allow deletion of guest users
      if (user.role !== "guest") {
        throw new Error("Only guest users can be deleted");
      }

      // Get all leagues the user is a member of
      const leagues = user.rankings?.map(r => r.league).filter(Boolean) || [];

      // Check if user has games in current season of any league
      for (const league of leagues) {
        const gamesInCurrentSeason = await gameRepo
          .createQueryBuilder("game")
          .innerJoin("game.players", "player")
          .innerJoin("player.user", "user")
          .where("user.id = :userId", { userId })
          .andWhere("game.league.id = :leagueId", { leagueId: league.id })
          .andWhere("game.seasonNumber = :seasonNumber", {
            seasonNumber: league.currentSeasonNumber,
          })
          .getCount();

        if (gamesInCurrentSeason > 0) {
          throw new Error(
            `Cannot delete user: has ${gamesInCurrentSeason} game(s) in current season of ${league.name}`
          );
        }
      }

      // Delete the user (this will cascade to rankings in current season)
      await userRepo.remove(user);

      return { success: true, message: "User deleted successfully" };
    });
  }
}
