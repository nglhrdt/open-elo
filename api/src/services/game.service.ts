import { Service } from "typedi";
import { FindManyOptions, In } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { GameEntity } from "../database/entity/game.entity";
import { PlayerEntity } from "../database/entity/player.entity";
import { LeagueService } from "./league.service";
import { RankingService } from "./ranking.service";
import { UserService } from "./user.service";

export type CreateGame = { score: string, players: { id: string, team: 'home' | 'away' }[], leagueId: string };

@Service()
export class GameService {
  private repository = AppDataSource.getRepository(GameEntity);

  constructor(
    private userService: UserService,
    private rankingService: RankingService,
    private leagueService: LeagueService,
  ) { }

  getAllGames(options: FindManyOptions<GameEntity> = {}) {
    return this.repository.find({
      ...options,
      relations: ["players", "players.user"]
    });
  }

  async createGame(gameData: CreateGame) {
    const users = await this.userService.getAllUsers({ where: { id: In(gameData.players.map(p => p.id)) } });

    const players = users.map((u) => {
      const player = new PlayerEntity();
      player.user = u;
      player.team = gameData.players.find(p => p.id === u.id)!.team;
      return player;
    });

    const league = await this.leagueService.getLeagueById(gameData.leagueId);
    if (!league) throw new Error("League not found");

    const game = { players, score: gameData.score, league };

    const [homeScore, awayScore] = gameData.score.split('-').map(s => parseInt(s, 10));

    let result: 'home' | 'away' | 'draw' = 'draw';
    if (homeScore > awayScore) result = 'home';
    else if (awayScore > homeScore) result = 'away';

    // Persist Elo before/after per player
    const snapshot = await this.rankingService.updatePlayerElosWithSnapshot(gameData.players, result, gameData.leagueId);

    for (const p of players) {
      const s = snapshot[p.user.id];
      p.eloBefore = s?.before ?? null;
      p.eloAfter = s?.after ?? null;
    }

    return this.repository.save(game);
  }

  getGameById(id: string) {
    return this.repository.findOne({
      where: { id },
      relations: ["players", "players.user", "league"]
    });
  }

  async deleteGame(id: string) {
    const game = await this.getGameById(id);
    if (!game) throw new Error("Game not found");

    // Revert ELO to before values
    const eloRevertSnapshot: Record<string, number> = {};
    for (const player of game.players) {
      if (player.eloBefore !== null) {
        eloRevertSnapshot[player.user.id] = player.eloBefore;
      }
    }

    await this.rankingService.revertEloToSnapshot(eloRevertSnapshot, game.league.id);

    // Delete players first to avoid foreign key constraint violation
    const playerRepository = AppDataSource.getRepository(PlayerEntity);
    await playerRepository.remove(game.players);

    // Delete the game
    await this.repository.remove(game);

    return { success: true };
  }
}
