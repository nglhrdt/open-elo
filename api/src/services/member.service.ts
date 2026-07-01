import { Member } from "@open-elo/shared";
import { Service } from "typedi";
import { AppDataSource } from "../database/data-source";
import { MemberEntity } from "../database/entity/member.entity";
import { ROLE, UserEntity } from "../database/entity/user.entity";

@Service()
export class MemberService {
  private memberRepository = AppDataSource.getRepository(MemberEntity);
  private userRepository = AppDataSource.getRepository(UserEntity);

  async getLeagueMembers(leagueId: string) {
    const members = await this.memberRepository.find({
      where: {
        league: {
          id: leagueId,
        },
      },
      relations: ["user"],
      order: {
        user: {
          username: "ASC",
        },
      },
    });
    return this.toDTOs(members.map((member) => member.user));
  }

  createGuestUser(id: string, username: string) {
    return AppDataSource.transaction(async (transactionalEntityManager) => {
      const user = this.userRepository.create({
        username,
        role: ROLE.GUEST,
      });
      await transactionalEntityManager.save(user);

      const member = this.memberRepository.create({
        league: { id },
        user,
      });
      await transactionalEntityManager.save(member);

      return this.toDTO(user);
    });
  }

  async removeMember(leagueId: string, userId: string) {
    const member = await this.memberRepository.findOne({
      where: {
        league: { id: leagueId },
        user: { id: userId },
      },
      relations: ["user"],
    });

    if (!member) {
      throw new Error("Member not found");
    }
    await this.memberRepository.remove(member);
  }

  toDTOs(entities: UserEntity[]): Member[] {
    return entities.map((entity) => this.toDTO(entity));
  }

  toDTO(entity: UserEntity): Member {
    return {
      id: entity.id,
      username: entity.username,
    };
  }
}
