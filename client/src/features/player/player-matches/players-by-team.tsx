import type { Match } from '@open-elo/shared';
import { TeamElo } from './team-elo';

type PlayersByTeamProps = {
  match: Match;
  team: 'HOME' | 'AWAY';
};

export function PlayersByTeam({ match, team }: PlayersByTeamProps) {
  const teamPlayers = match.players.filter((p) => p.team === team);

  return (
    <div className="flex gap-1 flex-col lg:flex-row">
      {teamPlayers.map((p) => (
        <div key={match.id + p.userId} className="text-sm">
          {p.username} ({p.eloBefore})
        </div>
      ))}
      <TeamElo match={match} team={team} />
    </div>
  );
}
