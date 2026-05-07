export type GetMatchesParams = {
    playerId: string;
    seasonId: string;
    take: number;
    skip: number;
};

export type Team = 'HOME' | 'AWAY';

export type MatchPlayer = {
    userId: string;
    username: string;
    team: Team;
    eloBefore: number | null;
    eloAfter: number | null;
    eloChange: number | null;
};

export type Match = {
    id: string;
    score: string;
    seasonId: string;
    leagueId: string;
    createdAt: Date;
    players: MatchPlayer[];
};

export type GetMatchesResponse = {
    matches: Match[];
    totalCount: number;
};

export type CreateMatchData = {
  score: string;
  players: { id: string, team: Team }[];
  seasonId: string;
}