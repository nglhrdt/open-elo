export type SeasonStats = {
  elo: number | null;
  position: number | null;
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

export type EloChartData = {
  date: string;
  [username: string]: string | number;
}