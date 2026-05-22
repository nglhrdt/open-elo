import { EloChartData, Match, Season } from "@open-elo/shared";
import { Service } from "typedi";
import { And, IsNull, LessThan, Not } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { LeagueEntity } from "../database/entity/league.entity";
import { MatchEntity, WINNER } from "../database/entity/match.entity";
import { RankingEntity } from "../database/entity/ranking.entity";
import { SeasonEntity } from "../database/entity/season.entity";
import { RankingDTO } from "../dtos";

@Service()
export class SeasonService {
  private seasonRepository = AppDataSource.getRepository(SeasonEntity);
  private leagueRepository = AppDataSource.getRepository(LeagueEntity);
  private matchRepository = AppDataSource.getRepository(MatchEntity);
  private rankingRepository = AppDataSource.getRepository(RankingEntity);

  async getSeasons(leagueId: string) {
    const seasons = await this.seasonRepository.find({
      where: { league: { id: leagueId } },
      relations: ["league", "league.game"],
      order: { seasonNumber: "DESC" },
    });

    return seasons.map(season => this.toDTO(season));
  }

  async getSeasonById(id: string) {
    const season = await this.seasonRepository.findOne({
      where: { id },
      relations: ["league", "league.game", "league.currentSeason"],
    });

    if (!season) return null;

    return this.toDTO(season);
  }

  async getSeasonRankings(id: string) {
    const rankings = await this.rankingRepository.find({
      where: { season: { id } },
      relations: ["user", "season", "season.league"],
    });

    return this.createRankingDTOs(rankings);
  }

  async setSeasonEnd(id: string, endAt: Date | undefined) {
    const season = await this.seasonRepository.findOne({ where: { id } });
    if (!season) return null;
    season.endAt = endAt;
    await this.seasonRepository.save(season);
    return this.getSeasonById(id);
  }

  createRankingDTOs(rankings: RankingEntity[]): RankingDTO[] {
    let positionCounter = 1;
    return rankings
      .sort((r1, r2) => r2.elo - r1.elo)
      .map((ranking, i, rankings) => ({
        id: ranking.id,
        position: i === 0 || rankings[i - 1].elo === ranking.elo ? positionCounter : ++positionCounter,
        userId: ranking.user.id,
        username: ranking.user.username,
        elo: ranking.elo,
        leagueId: ranking.season.league.id,
      }));
  }

  async getSeasonMatches(id: string, count?: number): Promise<Match[] | null> {
    const matches = await this.matchRepository.find({
      where: {
        season: {
          id,
        },
      },
      order: { createdAt: "DESC" },
      relations: ["players", "players.user", "season", "season.league", "season.league.game"],
      take: count,
    });

    return matches.map(match => ({
      id: match.id,
      score: `${match.homeScore}-${match.awayScore}`,
      seasonId: match.season.id,
      leagueId: match.season.league.id,
      createdAt: match.createdAt,
      winningTeam: match.homeScore > match.awayScore ? WINNER.HOME : match.awayScore > match.homeScore ? WINNER.AWAY : WINNER.DRAW,
      players: match.players.map(player => ({
        userId: player.user.id,
        username: player.user.username,
        team: player.team,
        eloBefore: player.eloBefore,
        eloAfter: player.eloAfter,
        eloChange: 0,
      })),
    }));
  }

  async getSeasonEloChart(seasonId: string, lastMatchesCount = 10): Promise<EloChartData[]> {
    const matches = await this.matchRepository.find({
      where: {
        season: {
          id: seasonId,
        },
      },
      order: { createdAt: "ASC" },
      relations: ["players", "players.user"],
    });

    const chartData = matches.reduce((acc, match) => {
      match.players.forEach(player => {
        acc.lastPlayerElos.set(player.user.id, { username: player.user.username, elo: player.eloAfter ?? 1000 });
      });
      const dataSet: { date: string, [username: string]: string | number } = { date: match.createdAt.toISOString() };
      acc.lastPlayerElos.forEach((value, key) => {
        dataSet[value.username] = value.elo;
      });
      acc.data.push(dataSet);
      return acc;
    }, { lastPlayerElos: new Map<string, { username: string, elo: number }>(), data: [] as EloChartData[] });

    return chartData.data.slice(-lastMatchesCount);
  }

  async stopSeasons() {
    const leaguesWithEndedSeason = await this.leagueRepository.find({
      where: { currentSeason: { endAt: And(Not(IsNull()), LessThan(new Date())) } },
      relations: ["currentSeason"],
    });

    for (const league of leaguesWithEndedSeason) {
      const season = await this.seasonRepository.save({
        league,
        seasonNumber: league.currentSeason.seasonNumber + 1,
        startAt: league.currentSeason.endAt,
      });

      league.currentSeason = season;

      await this.leagueRepository.save(league);
    }

    return leaguesWithEndedSeason.map(league => ({
      leagueId: league.id,
      leagueName: league.name,
      newSeasonId: league.currentSeason.id,
      newSeasonStartAt: league.currentSeason.startAt,
    }));
  }

  toDTO(entity: SeasonEntity): Season {
    return {
      id: entity.id,
      league: {
        id: entity.league.id,
        name: entity.league.name,
        game: entity.league.game.game,
      },
      seasonNumber: entity.seasonNumber,
      isCurrentSeason: entity.league.currentSeason?.id === entity.id,
      startAt: entity.startAt,
      endAt: entity.endAt,
    };
  }

}
