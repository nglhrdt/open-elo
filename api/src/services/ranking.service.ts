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
    const rankings = await this.getRankings({ where: { user: { id: userId } } });

    // Get all rankings for each league the user is in
    const leagueIds = rankings.map(r => r.league.id);
    const allRankingsByLeague = await Promise.all(
      leagueIds.map(leagueId =>
        this.getRankings({ where: { league: { id: leagueId } } })
      )
    );

    return rankings.map((r, idx) => {
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

    const ranking = this.repository.create();
    ranking.league = league;
    ranking.user = user;

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
