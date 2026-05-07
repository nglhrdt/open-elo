import type { Match } from '@open-elo/shared';

type TeamEloProps = {
  match: Match;
  team: 'HOME' | 'AWAY';
};

export function TeamElo({ match, team }: TeamEloProps) {
  const teamElo = Math.floor(
    match.players
      .filter((p) => p.team === team)
      .reduce((sum, p) => sum + (p.eloBefore ?? 0), 0) /
      match.players.filter((p) => p.team === team).length,
  );

  return <div>Team ({teamElo})</div>;
}
