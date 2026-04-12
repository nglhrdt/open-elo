import { Service } from "typedi";
import { In } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { TEAM } from "../database/entity/player.entity";
import { RankingEntity } from "../database/entity/ranking.entity";
import { CreateMatchPlayerDTO } from "../dtos";
import { SeasonEntity } from "../database/entity/season.entity";
import { UserEntity } from "../database/entity/user.entity";

@Service()
export class EloService {
  private rankingRepository = AppDataSource.getRepository(RankingEntity);
  private seasonRepository = AppDataSource.getRepository(SeasonEntity);
  private userRepository = AppDataSource.getRepository(UserEntity);

  /**
  * Updates player Elos and returns before/after snapshot per userId.
  */
  async updatePlayerElosWithSnapshot(
    players: CreateMatchPlayerDTO[],
    result: 'HOME' | 'AWAY' | 'DRAW',
    seasonId: string,
  ): Promise<Record<string, { before: number; after: number }>> {
    const snapshot: Record<string, { before: number; after: number }> = {};

    for (const p of players) {
      const before = await this.getElo(p.id, seasonId);
      snapshot[p.id] = { before, after: before };
    }

    await this.updatePlayerElos(players, result, seasonId);

    for (const p of players) {
      const after = await this.getElo(p.id, seasonId);
      snapshot[p.id].after = after;
    }

    return snapshot;
  }

  private async updatePlayerElos(
    players: CreateMatchPlayerDTO[],
    winningTeam: "HOME" | "AWAY" | "DRAW",
    seasonId: string,
    kFactor = 32,
  ) {
    const homeTeamRankings = await this.getRankingByUserIdsAndSeasonId(
      players.filter((p) => p.team === TEAM.HOME).map((p) => p.id),
      seasonId
    );
    const awayTeamRankings = await this.getRankingByUserIdsAndSeasonId(
      players.filter((p) => p.team === TEAM.AWAY).map((p) => p.id),
      seasonId
    );

    const teamA = this.getTeamElo(homeTeamRankings);
    const teamB = this.getTeamElo(awayTeamRankings);

    const expectedA = this.getExpectedScore(teamA, teamB);
    const expectedB = 1 - expectedA;

    const scoreA = winningTeam === "HOME" ? 1 : winningTeam === "DRAW" ? 0.5 : 0;

    const newTeamA = this.updateTeamElo(teamA, expectedA, scoreA, kFactor);
    const newTeamB = this.updateTeamElo(teamB, expectedB, 1 - scoreA, kFactor);

    const diffA = newTeamA - teamA;
    const diffB = newTeamB - teamB;

    homeTeamRankings.forEach((ranking) => {
      ranking.elo = Math.round(ranking.elo + diffA);
    });
    awayTeamRankings.forEach((ranking) => {
      ranking.elo = Math.round(ranking.elo + diffB);
    });

    await this.rankingRepository.save([...homeTeamRankings, ...awayTeamRankings]);
  }

  private async getElo(playerId: string, seasonId: string) {
    const ranking = await this.rankingRepository.findOne({
      where: { user: { id: playerId }, season: { id: seasonId } },
    });

    if (!ranking) {
      const newRanking = await this.createInitialSeasonRanking(playerId, seasonId);
      return newRanking.elo;
    }

    return ranking.elo;
  }

  private async createInitialSeasonRanking(userId: string, seasonId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const season = await this.seasonRepository.findOne({ where: { id: seasonId } });
    if (!user || !season) throw new Error("User or Season not found");
    const ranking = this.rankingRepository.create({
      user,
      season,
      elo: 1000,
    });
    return this.rankingRepository.save(ranking);
  }

  /**
   * Revert ELO ratings to specific values (used when deleting a game)
   */
  async revertEloToSnapshot(snapshot: Record<string, number>, seasonId: string) {
    const userIds = Object.keys(snapshot);
    const rankings = await this.getRankingByUserIdsAndSeasonId(userIds, seasonId);

    for (const ranking of rankings) {
      const revertValue = snapshot[ranking.user.id];
      if (revertValue !== undefined) {
        ranking.elo = revertValue;
      }
    }

    await this.rankingRepository.save(rankings);
  }

  private getTeamElo(rankings: RankingEntity[]): number {
    const totalElo = rankings.reduce((sum, ranking) => sum + ranking.elo, 0);
    return totalElo / rankings.length;
  }

  private getExpectedScore(teamA: number, teamB: number): number {
    return 1 / (1 + Math.pow(10, (teamB - teamA) / 400));
  }

  private updateTeamElo(teamElo: number, expectedScore: number, actualScore: number, kFactor = 32): number {
    return teamElo + kFactor * (actualScore - expectedScore);
  }

  private getRankingByUserIdsAndSeasonId(userIDs: string[], seasonId: string): Promise<RankingEntity[]> {
    return this.rankingRepository.find({
      where: { user: { id: In(userIDs) }, season: { id: seasonId } },
      relations: ["season", "user"],
    });
  }
}

