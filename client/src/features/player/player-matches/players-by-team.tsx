import UserAvatar from '@/components/user-avatar';
import type { Match } from '@open-elo/shared';
import { Link } from 'react-router';

type PlayersByTeamProps = {
  match: Match;
  team: 'HOME' | 'AWAY';
};

export function PlayersByTeam({ match, team }: PlayersByTeamProps) {
  const teamPlayers = match.players.filter((p) => p.team === team);

  return (
    <div className="flex gap-4 flex-col lg:flex-row">
      {teamPlayers.map((p) => (
        <div key={match.id + p.userId} className="flex gap-2">
          <Link
            to={`/leagues/${match.leagueId}/seasons/${match.seasonId}/players/${p.userId}`}
            className="text-primary hover:underline"
          >
            <UserAvatar userId={p.userId} showName size="size-8" />
          </Link>
        </div>
      ))}
    </div>
  );
}
