import { Service } from "typedi";
import { FindManyOptions, LessThanOrEqual } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { GameEntity } from "../database/entity/game.entity";
import { LEAGUE_TYPE, LeagueEntity } from "../database/entity/league.entity";
import { RankingEntity } from "../database/entity/ranking.entity";
import { SeasonHistoryEntity } from "../database/entity/season-history.entity";
import { UserEntity } from "../database/entity/user.entity";
import { UserService } from "./user.service";

@Service()
export class LeagueService {

  constructor(private userService: UserService) { }

  private leagueRepository = AppDataSource.getRepository(LeagueEntity);
  private rankingRepository = AppDataSource.getRepository(RankingEntity);
  private gameRepository = AppDataSource.getRepository(GameEntity);
  private seasonHistoryRepository = AppDataSource.getRepository(SeasonHistoryEntity);

  async getAllLeagues(options: FindManyOptions<LeagueEntity> = {}) {
    return (await this.leagueRepository.find(options)).map(l => ({ id: l.id, name: l.name, type: l.type }));
  }

  async createLeague(data: { name: string, type: LEAGUE_TYPE, ownerId: string }) {
    const owner = await this.userService.getUserById(data.ownerId);
    if (!owner) throw new Error("Owner not found");
    const league = this.leagueRepository.create({ name: data.name, type: data.type });
    league.owner = owner;
    return this.leagueRepository.save(league);
  }

  async getLeagueById(id: string) {
    const league = await this.leagueRepository.findOne({
      where: { id },
      relations: ['owner']
    });

    if (!league) return null;

    // Ensure owner is properly loaded and formatted
    const owner = await league.owner;
    return {
      ...league,
      owner
    };
  }

  async updateLeagueSeasonSettings(
    leagueId: string,
    userId: string,
    settings: { seasonEnabled?: boolean, seasonEndDate?: string }
  ) {
    const league = await this.leagueRepository.findOne({
      where: { id: leagueId },
      relations: ['owner']
    });

    if (!league) throw new Error("League not found");

    const owner = await league.owner;
    if (owner.id !== userId) {
      throw new Error("Only the league owner can update season settings");
    }

    if (settings.seasonEnabled !== undefined) {
      league.seasonEnabled = settings.seasonEnabled;
    }

    if (settings.seasonEndDate !== undefined) {
      league.seasonEndDate = settings.seasonEndDate ? new Date(settings.seasonEndDate) : null;
    }

    return this.leagueRepository.save(league);
  }

  async processEndedSeasons() {
    const now = new Date();

    // Find all leagues with seasons that have ended
    const endedLeagues = await this.leagueRepository.find({
      where: {
        seasonEnabled: true,
        seasonEndDate: LessThanOrEqual(now)
      },
      relations: ['owner']
    });

    const results = [];

    for (const league of endedLeagues) {
      try {
        // Get current season rankings
        const rankings = await this.rankingRepository.find({
          where: {
            league: { id: league.id },
            seasonNumber: league.currentSeasonNumber
          },
          relations: ['user'],
          order: { elo: 'DESC' }
        });

        // Persist season history
        const seasonRankings = rankings.map((r, index) => ({
          userId: r.user.id,
          username: r.user.username,
          elo: r.elo,
          position: index + 1
        }));

        const seasonHistory = this.seasonHistoryRepository.create({
          seasonNumber: league.currentSeasonNumber,
          endDate: league.seasonEndDate,
          rankings: seasonRankings,
          league: league
        });

        await this.seasonHistoryRepository.save(seasonHistory);

        // Start new season
        league.currentSeasonNumber += 1;
        league.seasonEndDate = null; // No end date for new season
        await this.leagueRepository.save(league);

        // Create new rankings for all players with reset ELO
        const newRankings = rankings.map(r => {
          const newRanking = this.rankingRepository.create({
            elo: 1000,
            seasonNumber: league.currentSeasonNumber,
            league: league,
            user: r.user
          });
          return newRanking;
        });

        await this.rankingRepository.save(newRankings);

        results.push({
          leagueId: league.id,
          leagueName: league.name,
          previousSeason: league.currentSeasonNumber - 1,
          newSeason: league.currentSeasonNumber,
          playersReset: newRankings.length
        });
      } catch (error) {
        results.push({
          leagueId: league.id,
          leagueName: league.name,
          error: error.message
        });
      }
    }

    return {
      processed: results.length,
      results
    };
  }

  async getUsersByLeagueId(id: string): Promise<UserEntity[]> {
    // Fetch rankings (with users) for the league - current season only
    const rankings = await this.rankingRepository
      .createQueryBuilder("ranking")
      .innerJoinAndSelect("ranking.user", "user")
      .innerJoinAndSelect("ranking.league", "league")
      .where("league.id = :id", { id })
      .andWhere("ranking.seasonNumber = league.currentSeasonNumber")
      .andWhere("user.deleted = :deleted", { deleted: false })
      .getMany();

    if (rankings.length === 0) return [];

    // Extract and de-duplicate users
    const unique = new Map<string, UserEntity>();
    for (const r of rankings) {
      if (r.user) unique.set(r.user.id, r.user);
    }
    return Array.from(unique.values());
  }

  async getGamesByLeagueId(id: string, count = 10, seasonNumber?: number): Promise<GameEntity[]> {
    // Get the league to access current season
    const league = await this.leagueRepository.findOne({ where: { id } });
    if (!league) return [];

    const targetSeason = seasonNumber ?? league.currentSeasonNumber;

    return this.gameRepository.find({
      where: {
        league: { id },
        seasonNumber: targetSeason,
      },
      order: {
        createdAt: "DESC",
      },
      take: count,
      relations: ["players", "players.user"],
    });
  }

  async getAvailableSeasons(leagueId: string): Promise<number[]> {
    const result = await this.gameRepository
      .createQueryBuilder('game')
      .select('DISTINCT game.seasonNumber', 'seasonNumber')
      .where('game.leagueId = :leagueId', { leagueId })
      .orderBy('game.seasonNumber', 'DESC')
      .getRawMany();

    return result.map(r => r.seasonNumber);
  }
}
