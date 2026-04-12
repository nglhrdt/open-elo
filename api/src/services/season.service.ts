import { Service } from "typedi";
import { And, IsNull, LessThan, Not } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { LeagueEntity } from "../database/entity/league.entity";
import { MatchEntity } from "../database/entity/match.entity";
import { RankingEntity } from "../database/entity/ranking.entity";
import { SeasonEntity } from "../database/entity/season.entity";
import { MatchDTO } from "../dtos";
import { CreateSeasonDTO, SeasonDTO } from "../dtos/season";

@Service()
export class SeasonService {
  private seasonRepository = AppDataSource.getRepository(SeasonEntity);
  private leagueRepository = AppDataSource.getRepository(LeagueEntity);
  private matchRepository = AppDataSource.getRepository(MatchEntity);

  async createSeason(dto: CreateSeasonDTO) {
    const league = await this.leagueRepository.findOne({
      where: { id: dto.leagueId },
    });
    if (!league) throw new Error("League not found");

    return this.seasonRepository.save({
      league,
      seasonNumber: 1,
      startAt: dto.startAt,
      endAt: dto.endAt,
    }).then(season => this.toDTO(season));
  }

  async getSeasonById(id: string) {
    const season = await this.seasonRepository.findOne({
      where: { id },
      relations: ["league", "league.game", "matches.players", "rankings.user"],
    });

    if (!season) return null;

    return this.toDTO(season);
  }

  async getSeasonRankings(id: string) {
    const season = await this.seasonRepository.findOne({
      where: { id },
      relations: ["league", "league.game", "rankings", "rankings.user"],
    });

    if (!season) return null;

    return {
      season: this.toDTO(season),
      rankings: this.createRankingDTOs(season.rankings),
    };
  }

  async setSeasonEnd(id: string, endAt: Date | undefined) {
    const season = await this.seasonRepository.findOne({ where: { id }, relations: ["league", "league.game", "matches.players", "rankings.user"] });
    if (!season) return null;
    season.endAt = endAt;
    return this.seasonRepository.save(season).then(updated => this.toDTO(updated));
  }

  createRankingDTOs(rankings: RankingEntity[]) {
    let positionCounter = 1;
    return rankings.sort((r1, r2) => r2.elo - r1.elo).map((ranking, i, rankings) => ({
      id: ranking.id,
      position: i === 0 || rankings[i - 1].elo === ranking.elo ? positionCounter : ++positionCounter,
      user: {
        id: ranking.user.id,
        username: ranking.user.username,
      },
      elo: ranking.elo,
    }));
  }

  async getSeasonMatches(id: string, count?: number): Promise<MatchDTO[] | null> {
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
      score: match.score,
      leagueId: match.season.league.id,
      createdAt: match.createdAt.toISOString(),
      updatedAt: match.updatedAt.toISOString(),
      players: match.players.map(player => ({
        id: player.id,
        eloBefore: player.eloBefore,
        eloAfter: player.eloAfter,
        user: {
          id: player.user.id,
          username: player.user.username,
          email: player.user.email,
          role: player.user.role,
        },
        team: player.team,
      })),
      seasonId: match.season.id,
    }));
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

  toDTO(entity: SeasonEntity): SeasonDTO {
    return {
      id: entity.id,
      league: {
        id: entity.league.id,
        name: entity.league.name,
        game: entity.league.game.game,
      },
      seasonNumber: entity.seasonNumber,
      startAt: entity.startAt,
      endAt: entity.endAt,
    };
  }

}
