import { Service } from "typedi";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { GameEntity } from "../database/entity/game.entity";
import { UserEntity } from "../database/entity/user.entity";

@Service()
export class UserService {
  private repository = AppDataSource.getRepository(UserEntity);
  private gameRepository = AppDataSource.getRepository(GameEntity);

  getAllUsers(options: FindManyOptions<UserEntity> = {}) {
    return this.repository.find(options);
  }

  createUser(user: { username: string; email: string; passwordHash: string }) {
    return this.repository.save({ ...user, role: "user" });
  }

  getUserById(id: string) {
    return this.repository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  findByUsername(username: string) {
    return this.repository.findOneBy({ username });
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
