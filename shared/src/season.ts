export type GetSeasonsParams = {
    leagueId: string;
};

export type Season = {
    id: string;
    league: {
        id: string;
        name: string;
        game: 'TABLE_SOCCER';
    };
    seasonNumber: number;
    isCurrentSeason: boolean;
    startAt: Date;
    endAt?: Date;
}
