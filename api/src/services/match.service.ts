import { Service } from "typedi";
import { In } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { MatchEntity } from "../database/entity/match.entity";
import { SeasonEntity } from "../database/entity/season.entity";
import { UserEntity } from "../database/entity/user.entity";
import { CreateMatchDTO } from "../dtos";
import { EloService } from "./elo.service";

type Result = "HOME" | "AWAY" | "DRAW";

@Service()
export class MatchService {
  private matchRepository = AppDataSource.getRepository(MatchEntity);
  private userRepository = AppDataSource.getRepository(UserEntity);
  private seasonRepository = AppDataSource.getRepository(SeasonEntity);

  constructor(private eloService: EloService) { }

  async createMatch(seasonId: string, { players, score }: CreateMatchDTO) {
    const season = await this.seasonRepository.findOne({
      where: { id: seasonId },
      relations: ["league"],
    });
    if (!season) throw new Error("Season not found");

    const users = await this.userRepository.find({
      where: { id: In(players.map((p) => p.id)) },
    });

    const eloSnapshot = await this.eloService.updatePlayerElosWithSnapshot(
      players,
      this.getResult({ players, score }),
      seasonId,
    );

    const playerEntities = players.flatMap((player) => {
      const user = users.find((u) => u.id === player.id);
      if (!user) return [];
      return [{
        eloAfter: eloSnapshot[user.id]?.after ?? null,
        eloBefore: eloSnapshot[user.id]?.before ?? null,
        team: player.team,
        user,
      }];
    });

    return this.matchRepository.save({
      score,
      season,
      players: playerEntities,
    });
  }

  private getResult(matchData: CreateMatchDTO): Result {
    const [homeScore, awayScore] = matchData.score
      .split("-")
      .map((s) => parseInt(s, 10));

    let result: Result = "DRAW";
    if (homeScore > awayScore) result = "HOME";
    else if (awayScore > homeScore) result = "AWAY";
    return result;
  }

  getMatchById(id: string) {
    return this.matchRepository.findOne({
      where: { id },
      relations: ["players", "players.user", "league", "season"],
    });
  }

  async migrateMatch(seasonId: string, createdAt: Date, { players, score }: CreateMatchDTO) {
    const season = await this.seasonRepository.findOne({
      where: { id: seasonId },
      relations: ["league"],
    });
    if (!season) throw new Error("Season not found");

    const users = await this.userRepository.find({
      where: { id: In(players.map((p) => p.id)) },
    });

    const eloSnapshot = await this.eloService.updatePlayerElosWithSnapshot(
      players,
      this.getResult({ players, score }),
      seasonId,
    );

    const playerEntities = players.flatMap((player) => {
      const user = users.find((u) => u.id === player.id);
      if (!user) return [];
      return [{
        eloAfter: eloSnapshot[user.id]?.after ?? null,
        eloBefore: eloSnapshot[user.id]?.before ?? null,
        team: player.team,
        user,
      }];
    });

    return this.matchRepository.save({
      score,
      season,
      createdAt,
      players: playerEntities,
    });
  }
}
