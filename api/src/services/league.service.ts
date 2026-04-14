import { startOfDay } from "date-fns";
import { Service } from "typedi";
import { FindManyOptions, In, Not, } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { GameEntity } from "../database/entity/game.entity";
import { LeagueEntity } from "../database/entity/league.entity";
import { MemberEntity } from "../database/entity/member.entity";
import { SeasonEntity } from "../database/entity/season.entity";
import { UserEntity } from "../database/entity/user.entity";
import { LeagueDTO, UserDTO } from "../dtos";
import { CreateLeagueDTO } from "../dtos/league/create-league.dto";

@Service()
export class LeagueService {
  private leagueRepository = AppDataSource.getRepository(LeagueEntity);
  private userRepository = AppDataSource.getRepository(UserEntity);
  private gameRepository = AppDataSource.getRepository(GameEntity);
  private memberRepository = AppDataSource.getRepository(MemberEntity);
  private seasonRepository = AppDataSource.getRepository(SeasonEntity);

  async getAllLeagues(
    options: FindManyOptions<LeagueEntity> = {},
  ): Promise<LeagueDTO[]> {
    const leagues = await this.leagueRepository.find({
      ...options,
      relations: ["owner", "game", "members", "members.user", "seasons", "currentSeason"],
    });
    return leagues.map((league) => this.toDTO(league));
  }

  async getLeagueById(id: string) {
    const league = await this.leagueRepository.findOne({
      where: { id },
      relations: ["owner", "game", "currentSeason", "members", "members.user", "seasons"],
    });
    return league ? this.toDTO(league) : null;
  }

  async createLeague({ dto, user }: { dto: CreateLeagueDTO, user: UserDTO }) {
    const owner = await this.userRepository.findOne({
      where: { id: user.id },
    });
    if (!owner) throw new Error("Owner not found");

    const game = await this.gameRepository.findOne({
      where: { game: dto.game },
    });
    if (!game) throw new Error("Game not found");

    const league = await this.leagueRepository.save({
      name: dto.name,
      game,
      owner,
    });

    await this.memberRepository.save({
      league,
      user: owner,
    });

    if (!owner.favoriteLeague) {
      owner.favoriteLeague = league;
      await this.userRepository.save(owner);
    }

    const season = await this.seasonRepository.save({
      league,
      seasonNumber: 1,
      startAt: startOfDay(new Date()),
    });

    league.currentSeason = season;
    await this.leagueRepository.save(league);

    return league.id;
  }

  async joinLeague({ leagueId, user }: { leagueId: string; user: UserDTO }) {
    const league = await this.leagueRepository.findOne({
      where: { id: leagueId },
      relations: ["members", "members.user"],
    });
    if (!league) throw new Error("League not found");

    const existingMember = league.members.find((member) => member.user.id === user.id);
    if (existingMember) throw new Error("User is already a member of the league");

    const userEntity = await this.userRepository.findOne({ where: { id: user.id } });
    if (!userEntity) throw new Error("User not found");

    const member = await this.memberRepository.save({
      league,
      user: userEntity,
    });

    return member;
  }

  async getUserJoinedLeagues(id: string) {
    const leagues = await this.leagueRepository.find({
      where: {
        members: {
          user: {
            id,
          },
        },
        owner: {
          id: Not(id),
        },
      },
      relations: ["game", "owner", "currentSeason", "members", "members.user", "seasons"],
    });
    return leagues.map((league) => this.toDTO(league));
  }

  async getUserOwnedLeagues(id: string) {
    const leagues = await this.leagueRepository.find({
      where: {
        owner: {
          id,
        },
      },
      relations: ["game", "owner", "currentSeason", "members", "members.user", "seasons"],
    });
    return leagues.map((league) => this.toDTO(league));
  }

  async getUserAvailableLeagues(id: string) {
    const leagues = await this.leagueRepository.find({
      where: {
        members: {
          user: {
            id,
          },
        },
      },
      relations: ["game", "owner", "currentSeason", "members", "members.user", "seasons"],
    });

    const availableLeagues = await this.leagueRepository.find({
      where: {
        id: Not(In(leagues.map((league) => league.id))),
      },
      relations: ["game", "owner", "currentSeason", "members", "members.user", "seasons"],
    });

    return availableLeagues.map((league) => this.toDTO(league));
  }

  toDTO(entity: LeagueEntity): LeagueDTO {
    return {
      id: entity.id,
      name: entity.name,
      game: entity.game.game,
      owner: {
        id: entity.owner.id,
        username: entity.owner.username,
      },
      currentSeason: {
        id: entity.currentSeason.id,
        seasonNumber: entity.currentSeason.seasonNumber,
        startAt: entity.currentSeason.startAt,
        endAt: entity.currentSeason.endAt,
      },
      seasons: entity.seasons ? entity.seasons.map((season) => ({
        id: season.id,
        seasonNumber: season.seasonNumber,
        startAt: season.startAt,
        endAt: season.endAt,
      })) : [],
      members: entity.members ? entity.members.map((member) => ({
        id: member.user.id,
        username: member.user.username,
      })) : [],
    };
  }
}
