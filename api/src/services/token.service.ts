import { Service } from "typedi";
import { AppDataSource } from "../database/data-source";
import { TokenEntity } from "../database/entity/token.entity";
import { randomBytes } from "crypto";
import { LessThan } from "typeorm";

@Service()
export class TokenService {
  private tokenRepository = AppDataSource.getRepository(TokenEntity);

  async createToken(data: { leagueId: string, ownerId: string, validityDays: number }): Promise<TokenEntity> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + data.validityDays);

    const newToken = this.tokenRepository.create({
      token,
      expiresAt,
      revoked: false,
      owner: { id: data.ownerId } as any,
      league: { id: data.leagueId } as any,
    });

    const savedToken = await this.tokenRepository.save(newToken);

    // Fetch the token with relations to return complete data
    return this.tokenRepository.findOne({
      where: { id: savedToken.id },
      relations: ['league', 'owner'],
    }) as Promise<TokenEntity>;
  }

  async getTokensByOwnerId(ownerId: string): Promise<TokenEntity[]> {
    return this.tokenRepository.find({
      where: { owner: { id: ownerId } },
      relations: ['league', 'owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async getAllTokens(): Promise<TokenEntity[]> {
    return this.tokenRepository.find({
      relations: ['league', 'owner'],
      order: { createdAt: 'DESC' },
    });
  }

  async revokeToken(tokenId: string, ownerId: string): Promise<TokenEntity> {
    const token = await this.tokenRepository.findOne({
      where: { id: tokenId, owner: { id: ownerId } },
      relations: ['league', 'owner'],
    });

    if (!token) {
      throw new Error('Token not found or you do not have permission to revoke it');
    }

    token.revoked = true;
    return this.tokenRepository.save(token);
  }

  async validateToken(tokenString: string, leagueId: string): Promise<boolean> {
    const token = await this.tokenRepository.findOne({
      where: {
        token: tokenString,
        league: { id: leagueId },
        revoked: false,
      },
    });

    if (!token) {
      return false;
    }

    // Check if token is expired
    if (token.expiresAt < new Date()) {
      return false;
    }

    return true;
  }

  async getTokenByString(tokenString: string): Promise<TokenEntity | null> {
    const token = await this.tokenRepository.findOne({
      where: {
        token: tokenString,
        revoked: false,
      },
      relations: ['league', 'owner'],
    });

    if (!token) {
      return null;
    }

    // Check if token is expired
    if (token.expiresAt < new Date()) {
      return null;
    }

    return token;
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
