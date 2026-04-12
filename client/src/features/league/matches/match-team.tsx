import type { Match, Player } from '@/api/api';
import { MatchPlayerDialog } from './match-player-dialog';

type MatchTeamProps = {
  match: Match;
  team: 'HOME' | 'AWAY';
};

function getEloChange(player?: Player): number | null {
  if (!player?.eloAfter || !player.eloBefore) return null;

  return player.eloAfter - player.eloBefore;
}

export function MatchTeam(props: MatchTeamProps) {
  const { match, team } = props;

  const players = match.players.filter((p) => p.team === team);
  const [homeGoals, awayGoals] = match.score.split('-').map(Number);
  const isWinner =
    team === 'HOME' ? homeGoals > awayGoals : awayGoals > homeGoals;
  const eloChange = getEloChange(players[0]);

  return (
    <div
      className={`flex flex-col gap-2 items-center ${isWinner ? 'font-bold' : ''}`}
    >
      {players.map((player) => (
        <MatchPlayerDialog
          key={player.user.id}
          user={player.user}
          bold={isWinner}
          leagueId={match.leagueId}
          seasonId={match.seasonId}
        />
      ))}
      {eloChange !== null && <EloChange eloChange={eloChange} />}
    </div>
  );
}

function EloChange(props: { eloChange: number }) {
  const { eloChange } = props;
  if (eloChange === 0)
    return <span className="text-xs text-muted-foreground">No Elo change</span>;
  if (eloChange > 0)
    return <span className="text-xs text-green-500">+{eloChange} Elo</span>;
  return <span className="text-xs text-red-500">{eloChange} Elo</span>;
}
