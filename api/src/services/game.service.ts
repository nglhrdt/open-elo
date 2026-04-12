import { Service } from 'typedi';
import { FindManyOptions } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { GameEntity } from '../database/entity/game.entity';

@Service()
export class GameService {
  private repository = AppDataSource.getRepository(GameEntity);

  getAllGames(options: FindManyOptions<GameEntity> = {}) {
    return this.repository.find(options);
  }

  getGameById(id: string) {
    return this.repository.findOne({
      where: { id },
    });
  }

  getLeaguesForGame(gameId: string) {
    return this.repository.findOne({
      where: { id: gameId },
      relations: ['leagues'],
    });
  }
}
