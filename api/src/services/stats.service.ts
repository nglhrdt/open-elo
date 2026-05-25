import { Match, PlayerStats, SeasonStats, SeasonSummary } from "@open-elo/shared";
import { Service } from "typedi";
import { AppDataSource } from "../database/data-source";
import { WINNER } from "../database/entity/match.entity";
import { RankingEntity } from "../database/entity/ranking.entity";
import { MatchService } from "./match.service";

export enum RESULT {
  WON = 'WON',
  LOST = 'LOST',
  DRAW = 'DRAW',
}

@Service()
export class StatsService {
  constructor(
    private matchService: MatchService,
  ) { }

  async getUserSeasonStats(userId: string, seasonId: string): Promise<SeasonStats> {
    const matches = await this.matchService.getMatches({ playerId: userId, seasonId, skip: 0, take: 10000 })
    const elo = await this.getPlayerEloInSeason(userId, seasonId);
    const position = await this.getPlayerPositionInSeason(userId, seasonId);

    const stats = matches
      .matches
      .map(this.mapToTeamMatesAndOponents(userId))
      .reduce((stats, match) => {
        switch (match.result) {
          case RESULT.WON:
            stats.total.won++;
            match.teamMates.forEach(p => {
              this.getPlayerStats(stats, p).with.won++;
            });
            match.oponents.forEach(p => {
              this.getPlayerStats(stats, p).against.won++;
            });
            break;
          case RESULT.LOST:
            stats.total.lost++;
            match.teamMates.forEach(p => {
              this.getPlayerStats(stats, p).with.lost++;
            });
            match.oponents.forEach(p => {
              this.getPlayerStats(stats, p).against.lost++;
            });
            break;
          default:
            stats.total.draw++;
            match.teamMates.forEach(p => {
              this.getPlayerStats(stats, p).with.draw++;
            });
            match.oponents.forEach(p => {
              this.getPlayerStats(stats, p).against.draw++;
            });
            break;
        }

        return stats;
      }, {
        elo,
        position,
        byPlayer: new Map(),
        total: {
          won: 0,
          lost: 0,
          draw: 0,
        }
      } as SeasonStats)

    const summary = Array.from(stats.byPlayer.values()).reduce((summary, player) => {
      if (player.with.won > (summary.with.mostWins?.count ?? 0)) summary.with.mostWins = { count: player.with.won, userId: player.userId, username: player.username };
      if (player.with.lost > (summary.with.mostLost?.count ?? 0)) summary.with.mostLost = { count: player.with.lost, userId: player.userId, username: player.username };
      if (player.with.draw > (summary.with.mostDraw?.count ?? 0)) summary.with.mostDraw = { count: player.with.draw, userId: player.userId, username: player.username };
      if (player.against.won > (summary.against.mostWins?.count ?? 0)) summary.against.mostWins = { count: player.against.won, userId: player.userId, username: player.username };
      if (player.against.lost > (summary.against.mostLost?.count ?? 0)) summary.against.mostLost = { count: player.against.lost, userId: player.userId, username: player.username };
      if (player.against.draw > (summary.against.mostDraw?.count ?? 0)) summary.against.mostDraw = { count: player.against.draw, userId: player.userId, username: player.username };

      return summary
    }, { against: {}, with: {} } as SeasonSummary);

    return {
      ...stats,
      summary,
    }
  };

  private getPlayerStats(stats: SeasonStats, tm: { userId: string; username: string; }): PlayerStats {
    if (!stats.byPlayer.has(tm.userId)) {
      stats.byPlayer.set(tm.userId, this.getEmptyPlayerStats(tm));
    }

    return stats.byPlayer.get(tm.userId)!;
  }

  private getEmptyPlayerStats(tm: { userId: string; username: string; }): PlayerStats {
    return {
      userId: tm.userId,
      username: tm.username,
      with: {
        won: 0,
        lost: 0,
        draw: 0,
      }, against: {
        won: 0,
        lost: 0,
        draw: 0,
      }
    };
  }

  private mapToTeamMatesAndOponents(userId: string): (value: Match, index: number, array: Match[]) => { teamMates: { userId: string, username: string }[]; oponents: { userId: string, username: string }[]; result: RESULT; } {
    return m => {
      const playerTeam = m.players.find(p => p.userId === userId)!.team;
      const teamMates = m.players.filter(p => p.team === playerTeam && p.userId !== userId).map(p => ({ userId: p.userId, username: p.username }));
      const oponents = m.players.filter(p => p.team !== playerTeam).map(p => ({ userId: p.userId, username: p.username }));

      const result = m.winningTeam === WINNER.DRAW
        ? RESULT.DRAW
        : playerTeam === m.winningTeam
          ? RESULT.WON
          : RESULT.LOST;

      return {
        teamMates,
        oponents,
        result,
      };
    }
  }

  private async getPlayerPositionInSeason(userId: string, seasonId: string): Promise<number | null> {
    const exists = await AppDataSource
      .getRepository(RankingEntity)
      .exists({ where: { season: { id: seasonId }, user: { id: userId } } });

    if (!exists) return null;

    const rankings = await AppDataSource.getRepository(RankingEntity).find({
      where: { season: { id: seasonId } },
      order: { elo: "DESC" },
      relations: ["user"],
    });

    let positionCounter = 1;

    return rankings
      .map((ranking, i, rankings) => ({
        userId: ranking.user.id,
        position: i === 0 || rankings[i - 1].elo === ranking.elo ? positionCounter : ++positionCounter,
      }))
      .find(ranking => ranking.userId === userId)?.position ?? null;
  }

  private getPlayerEloInSeason(userId: string, seasonId: string): Promise<number | null> {
    return AppDataSource
      .getRepository(RankingEntity)
      .findOne({ where: { user: { id: userId }, season: { id: seasonId } } })
      .then(ranking => ranking?.elo ?? null);
  }
}
