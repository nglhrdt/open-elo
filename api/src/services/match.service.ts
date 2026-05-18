import { GetMatchesParams, Match } from "@open-elo/shared";
import { Service } from "typedi";
import { In } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { MatchEntity, WINNER } from "../database/entity/match.entity";
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
      homeScore: parseInt(score.split("-")[0], 10),
      awayScore: parseInt(score.split("-")[1], 10),
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
      relations: ["players", "players.user", "season", "season.league"],
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
      homeScore: parseInt(score.split("-")[0], 10),
      awayScore: parseInt(score.split("-")[1], 10),
      season,
      createdAt,
      players: playerEntities,
    });
  }

  async getMatches(params: GetMatchesParams) {
    const qb = this.matchRepository.createQueryBuilder("match")
      .leftJoinAndSelect("match.players", "player")
      .leftJoinAndSelect("player.user", "user")
      .innerJoinAndSelect("match.season", "season")
      .innerJoinAndSelect("season.league", "league")
      .where("season.id = :seasonId", { seasonId: params.seasonId })
      .orderBy("match.createdAt", "DESC");

    if (params.playerId) {
      qb.andWhere(qb2 =>
        `match.id IN (` +
        qb2.subQuery()
          .select("m.id")
          .from(MatchEntity, "m")
          .innerJoin("m.players", "fp")
          .innerJoin("fp.user", "fu")
          .where("fu.id = :playerId", { playerId: params.playerId })
          .andWhere("m.seasonId = :seasonId", { seasonId: params.seasonId })
          .getQuery() +
        `)`
      );
    }

    if (params.take) qb.take(params.take);
    if (params.skip) qb.skip(params.skip);

    const matches = await qb.getMany();
    return {
      matches: this.toDtos(matches),
      totalCount: await qb.getCount(),
    };
  }

  toDtos(matches: MatchEntity[]): Match[] {
    return matches.map((match) => this.toDto(match));
  }

  toDto(match: MatchEntity): Match {
    return {
      id: match.id,
      score: `${match.homeScore}-${match.awayScore}`,
      seasonId: match.season.id,
      leagueId: match.season.league.id,
      createdAt: match.createdAt,
      winningTeam: match.homeScore > match.awayScore ? WINNER.HOME : match.awayScore > match.homeScore ? WINNER.AWAY : WINNER.DRAW,
      players: match.players.map((player) => ({
        userId: player.user.id,
        username: player.user.username,
        team: player.team,
        eloBefore: player.eloBefore,
        eloAfter: player.eloAfter,
        eloChange: player.eloAfter !== null && player.eloBefore !== null
          ? player.eloAfter - player.eloBefore
          : null,
      })),
    };
  }
}
