import { League } from '@open-elo/shared';
import { IsEnum, IsInt, IsString, IsUUID } from 'class-validator';
import { GAME } from '../../database/entity/game.entity';

export class LeagueDTO implements League {
  @IsUUID()
  id!: string;
  @IsString()
  name!: string;
  @IsEnum(GAME)
  game!: GAME;
  @IsUUID()
  ownerId!: string;
  @IsUUID()
  currentSeasonId!: string;
  @IsInt()
  memberCount!: number;
}
