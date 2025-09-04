import { Service } from "typedi";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { UserEntity } from "../database/entity/user.entity";

@Service()
export class UserService {

  private repository = AppDataSource.getRepository(UserEntity);

  getAllUsers(options: FindManyOptions<UserEntity> = {}) {
    return this.repository.find(options);
  }

  createUser(user: { username: string; email: string; passwordHash: string }) {
    const isFirstUser = this.repository.count().then(count => count === 0);
    return this.repository.save({ ...user, role: isFirstUser ? "admin" : "user" });
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
}
