export type GetLeaguesParams = {
    playerId?: string;
};

export type GAME = 'TABLE_SOCCER';

export type League = {
    id: string;
    name: string;
    game: GAME;
    ownerId: string;
    currentSeasonId: string;
    memberCount: number;
}
