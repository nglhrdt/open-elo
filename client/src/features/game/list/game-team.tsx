import type { Game, Player } from "@/api/api";
import { UserGames } from "@/features/user/games/user-games-dialog";

type GameTeamProps = {
  game: Game;
  team: 'home' | 'away';
  leagueId?: string;
}

function getEloChange(player?: Player): number | null {
  if (!player?.eloAfter || !player.eloBefore) return null;

  return player.eloAfter - player.eloBefore;
}

export function GameTeam(props: GameTeamProps) {
  const { game, team, leagueId } = props;

  const players = game.players.filter(p => p.team === team);
  const [homeGoals, awayGoals] = game.score.split('-').map(Number);
  const isWinner = team === 'home' ? homeGoals > awayGoals : awayGoals > homeGoals;
  const eloChange = getEloChange(players[0]);

  return (<div className={`flex flex-col gap-2 items-center ${isWinner ? 'font-bold' : ''}`}>
    {players.map(player => (
      <UserGames
        key={player.user.id}
        user={player.user}
        bold={isWinner}
        leagueId={leagueId}
      />
    ))}
    {eloChange !== null && <EloChange eloChange={eloChange} />}
  </div>)
}

function EloChange(props: { eloChange: number }) {
  const { eloChange } = props;
  if (eloChange === 0) return <span className="text-xs text-muted-foreground">No Elo change</span>;
  if (eloChange > 0) return <span className="text-xs text-green-500">+{eloChange} Elo</span>;
  return <span className="text-xs text-red-500">{eloChange} Elo</span>;
}
