import { Service } from "typedi";
import { FindManyOptions, In } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { RankingEntity } from "../database/entity/ranking.entity";
import { LeagueService } from "./league.service";
import { UserService } from "./user.service";

@Service()
export class RankingService {
  private repository = AppDataSource.getRepository(RankingEntity);

  constructor(
    private leagueService: LeagueService,
    private userService: UserService,
  ) { }

  async getUserRankings(userId: string) {
    // First get user's rankings to know which leagues they're in
    const userRankings = await this.repository
      .createQueryBuilder("ranking")
      .innerJoinAndSelect("ranking.league", "league")
      .innerJoinAndSelect("ranking.user", "user")
      .where("user.id = :userId", { userId })
      .andWhere("ranking.seasonNumber = league.currentSeasonNumber")
      .getMany();

    // Get all rankings for each league the user is in (current season only)
    const leagueIds = userRankings.map(r => r.league.id);
    const allRankingsByLeague = await Promise.all(
      leagueIds.map(leagueId =>
        this.repository
          .createQueryBuilder("ranking")
          .innerJoinAndSelect("ranking.league", "league")
          .innerJoinAndSelect("ranking.user", "user")
          .where("league.id = :leagueId", { leagueId })
          .andWhere("ranking.seasonNumber = league.currentSeasonNumber")
          .getMany()
      )
    );

    return userRankings.map((r, idx) => {
      const sortedLeagueRankings = allRankingsByLeague[idx].sort((a, b) => b.elo - a.elo);
      // Add position to every ranking in the league
      const leagueRankings = sortedLeagueRankings.map((rank, i) => ({
        ...rank,
        position: i + 1,
      }));
      const position = leagueRankings.find(rank => rank.user.id === r.user.id)?.position || 0;
      return {
        id: r.id,
        elo: r.elo,
        league: {
          id: r.league.id,
          name: r.league.name,
          type: r.league.type
        },
        position,
        leagueRankings
      };
    });
  }

  async getLeagueRankings(leagueId: string, seasonNumber?: number) {
    const league = await this.leagueService.getLeagueById(leagueId);
    if (!league) throw new Error("League not found");

    const targetSeason = seasonNumber ?? league.currentSeasonNumber;

    const rankings = await this.repository
      .createQueryBuilder("ranking")
      .innerJoinAndSelect("ranking.league", "league")
      .innerJoinAndSelect("ranking.user", "user")
      .where("league.id = :leagueId", { leagueId })
      .andWhere("ranking.seasonNumber = :seasonNumber", { seasonNumber: targetSeason })
      .andWhere("user.deleted = :deleted", { deleted: false })
      .getMany();

    const sortedRankings = rankings.sort((a, b) => b.elo - a.elo);
    return sortedRankings.map((rank, i) => ({
      ...rank,
      position: i + 1,
    }));
  }

  async getRankings(options: FindManyOptions<RankingEntity> = {}) {
    return this.repository.find({
      relations: ["league", "user"],
      ...options,
    });
  }

  async joinUserToLeague(leagueID: string, userID: string) {
    const user = await this.userService.getUserById(userID);
    const league = await this.leagueService.getLeagueById(leagueID);

    if (!user || !league) {
      throw new Error("User or League not found");
    }

    if (user.role === "guest") {
      throw new Error("Guest users cannot join leagues. Please register to join.");
    }

    const ranking = this.repository.create();
    ranking.league = league;
    ranking.user = user;
    ranking.seasonNumber = league.currentSeasonNumber;

    return this.repository.save(ranking);
  }

  async leaveUserFromLeague(leagueID: string, userID: string) {
    const user = await this.userService.getUserById(userID);
    const league = await this.leagueService.getLeagueById(leagueID);

    if (!user || !league) {
      throw new Error("User or League not found");
    }

    const ranking = await this.repository.findOne({
      where: { league, user },
    });

    if (!ranking) {
      throw new Error("User is not part of this league");
    }

    return this.repository.remove(ranking);
  }

  async updatePlayerElos(
    players: { id: string; team: "home" | "away" }[],
    winningTeam: "home" | "away" | "draw",
    leagueId: string,
    kFactor = 32,
  ) {
    const teamARankings = await this.getRankingByUserIdsAndLeagueId(
      players.filter((p) => p.team === "home").map((p) => p.id),
      leagueId
    );
    const teamBRankings = await this.getRankingByUserIdsAndLeagueId(
      players.filter((p) => p.team === "away").map((p) => p.id),
      leagueId
    );

    const teamA = this.getTeamElo(teamARankings);
    const teamB = this.getTeamElo(teamBRankings);

    const expectedA = this.getExpectedScore(teamA, teamB);
    const expectedB = 1 - expectedA;

    const scoreA = winningTeam === "home" ? 1 : winningTeam === "draw" ? 0.5 : 0;

    const newTeamA = this.updateTeamElo(teamA, expectedA, scoreA, kFactor);
    const newTeamB = this.updateTeamElo(teamB, expectedB, 1 - scoreA, kFactor);

    const diffA = newTeamA - teamA;
    const diffB = newTeamB - teamB;

    teamARankings.forEach((ranking) => {
      ranking.elo = Math.round(ranking.elo + diffA);
    });
    teamBRankings.forEach((ranking) => {
      ranking.elo = Math.round(ranking.elo + diffB);
    });

    await this.repository.save([...teamARankings, ...teamBRankings]);
  }

  /**
   * Updates player Elos and returns before/after snapshot per userId.
   * Depends on existing getElo(...) and updatePlayerElos(...).
   */
  async updatePlayerElosWithSnapshot(
    players: { id: string; team: 'home' | 'away' }[],
    result: 'home' | 'away' | 'draw',
    leagueId: string,
  ): Promise<Record<string, { before: number; after: number }>> {
    const snapshot: Record<string, { before: number; after: number }> = {};

    // Capture 'before'
    for (const p of players) {
      const before = await this.getElo(p.id, leagueId); // adjust if your method name differs
      snapshot[p.id] = { before, after: before };
    }

    // Perform the update
    await this.updatePlayerElos(players, result, leagueId);

    // Capture 'after'
    for (const p of players) {
      const after = await this.getElo(p.id, leagueId);
      snapshot[p.id].after = after;
    }

    return snapshot;
  }

  getElo(playerId: string, leagueId: string) {
    return this.repository.findOne({
      where: { user: { id: playerId }, league: { id: leagueId } },
    }).then(ranking => ranking ? ranking.elo : 1000);
  }

  /**
   * Revert ELO ratings to specific values (used when deleting a game)
   */
  async revertEloToSnapshot(snapshot: Record<string, number>, leagueId: string) {
    const userIds = Object.keys(snapshot);
    const rankings = await this.getRankingByUserIdsAndLeagueId(userIds, leagueId);

    for (const ranking of rankings) {
      const revertValue = snapshot[ranking.user.id];
      if (revertValue !== undefined) {
        ranking.elo = revertValue;
      }
    }

    await this.repository.save(rankings);
  }

  private getTeamElo(rankings: RankingEntity[]): number {
    const totalElo = rankings.reduce((sum, ranking) => sum + ranking.elo, 0);
    return totalElo / rankings.length;
  }

  private getExpectedScore(teamA, teamB) {
    return 1 / (1 + Math.pow(10, (teamB - teamA) / 400));
  }

  private updateTeamElo(teamElo, expectedScore, actualScore, kFactor = 32) {
    return teamElo + kFactor * (actualScore - expectedScore);
  }

  private getRankingByUserIdsAndLeagueId(userIDs: string[], leagueId: string): Promise<RankingEntity[]> {
    return this.repository.find({
      where: { user: { id: In(userIDs) }, league: { id: leagueId } },
      relations: ["league", "user"],
    });
  }
}
