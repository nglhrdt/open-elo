import type { GAME } from "./league";

export type GetSeasonsParams = {
    leagueId: string;
};

export type Season = {
    id: string;
    league: {
        id: string;
        name: string;
        game: GAME;
    };
    seasonNumber: number;
    isCurrentSeason: boolean;
    startAt: Date;
    endAt?: Date;
}
