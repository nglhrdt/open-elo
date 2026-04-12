import { IsEnum, IsInt, IsUUID, ValidateNested } from "class-validator";
import { TEAM } from "../../database/entity/player.entity";
import { UserDTO } from "../user";

export class PlayerDTO {
    @IsUUID()
    id: string;

    @IsEnum(TEAM)
    team: TEAM;

    @ValidateNested()
    user: UserDTO;

    @IsInt()
    eloBefore: number | null;

    @IsInt()
    eloAfter: number | null;
}
