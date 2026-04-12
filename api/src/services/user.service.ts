import bcrypt from "bcrypt";
import { Service } from "typedi";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { GameEntity } from "../database/entity/game.entity";
import { ROLE, UserEntity } from "../database/entity/user.entity";

@Service()
export class UserService {
  private repository = AppDataSource.getRepository(UserEntity);
  private gameRepository = AppDataSource.getRepository(GameEntity);

  getAllUsers(options: FindManyOptions<UserEntity> = {}) {
    // Filter out deleted users by default
    const defaultOptions: FindManyOptions<UserEntity> = {
      where: { deleted: false },
      ...options,
    };
    return this.repository.find(defaultOptions);
  }

  createUser(user: {
    username: string;
    email?: string | null;
    passwordHash?: string | null;
    role: ROLE;
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
    return this.repository.findOne({
      where: { id },
      relations: ["favoriteLeague", "favoriteLeague.currentSeason", "favoriteLeague.game"],
    });
  }

  getUserByEmail(email: string) {
    return this.repository.findOne({
      where: { email },
      relations: ["favoriteLeague", "favoriteLeague.currentSeason", "favoriteLeague.game"],
    });
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
      user.role = ROLE.USER;

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
    //TODO delete user
    return { success: true, message: "User deleted successfully" };
  }
}
