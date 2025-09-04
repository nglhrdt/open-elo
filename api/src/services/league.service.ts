import { Service } from "typedi";
import { FindManyOptions } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { LeagueEntity } from "../database/entity/league.entity";
import { RankingEntity } from "../database/entity/ranking.entity";
import { UserEntity } from "../database/entity/user.entity";

@Service()
export class LeagueService {

  private leagueRepository = AppDataSource.getRepository(LeagueEntity);
  private rankingRepository = AppDataSource.getRepository(RankingEntity);

  async getAllLeagues(options: FindManyOptions<LeagueEntity> = {}) {
    return (await this.leagueRepository.find(options)).map(l => ({ id: l.id, name: l.name, type: l.type }));
  }

  createLeague(data: { name: string }) {
    return this.leagueRepository.save(data);
  }

  getLeagueById(id: string) {
    return this.leagueRepository.findOneBy({ id });
  }

  async getUsersByLeagueId(id: string): Promise<UserEntity[]> {
    // Fetch rankings (with users) for the league
    const rankings = await this.rankingRepository
      .createQueryBuilder("ranking")
      .innerJoinAndSelect("ranking.user", "user")
      .where("ranking.league = :id", { id })
      .getMany();

    if (rankings.length === 0) return [];

    // Extract and de-duplicate users
    const unique = new Map<string, UserEntity>();
    for (const r of rankings) {
      if (r.user) unique.set(r.user.id, r.user);
    }
    return Array.from(unique.values());
  }
}
