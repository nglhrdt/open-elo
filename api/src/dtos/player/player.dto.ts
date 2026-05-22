import { IsEnum, IsInt, IsString, IsUUID, ValidateNested } from "class-validator";
import { TEAM } from "../../database/entity/player.entity";
import { UserDTO } from "../user";
import { MatchPlayer } from "@open-elo/shared";

export class PlayerDTO implements MatchPlayer {
    @IsUUID()
    userId!: string;

    @IsString()
    username!: string;

    @IsInt()
    eloChange!: number | null;

    @IsUUID()
    id!: string;

    @IsEnum(TEAM)
    team!: TEAM;

    @ValidateNested()
    user!: UserDTO;

    @IsInt()
    eloBefore!: number | null;

    @IsInt()
    eloAfter!: number | null;
}
