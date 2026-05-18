
// export type SeasonStats = {
//     matchesCount: number;
//     winningRate: number;
//     losingRate: number;
//     drawRate: number;
//     mate: Mate | null;
//     rival: Mate | null;
//     mateWinCounter: Map<string, { userId: string, username: string, count: number }>;
//     mateLossCounter: Map<string, { userId: string, username: string, count: number }>;
//     rivalWinCounter: Map<string, { userId: string, username: string, count: number }>;
//     rivalLossCounter: Map<string, { userId: string, username: string, count: number }>;
// }

// export type Mate = {
//     id: string;
//     username: string;
//     winCount: number;
//     lossCount: number;
//     winningRate: number;
//     losingRate: number;
// }

export type SeasonStats = {
  byPlayer: Map<string, PlayerStats>;
  total: Total;
  summary: SeasonSummary
}

export type SeasonSummary = {
  with: {
    mostWins?: StatsUser;
    mostLost?: StatsUser;
    mostDraw?: StatsUser;
  }, against: {
    mostWins?: StatsUser;
    mostLost?: StatsUser;
    mostDraw?: StatsUser;
  }
};

export type StatsUser = {
  userId: string;
  username: string;
  count: number;
}

export type PlayerStats = {
  userId: string;
  username: string;
  with: Total;
  against: Total;
}

export type Total = {
  won: number;
  lost: number;
  draw: number;
}
