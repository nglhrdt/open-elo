import type { Game } from "@/api/api";
import { UserGames } from "@/features/user/games/user-games-dialog";

type GameTeamProps = {
  game: Game;
  team: 'home' | 'away';
}

export function GameTeam(props: GameTeamProps) {
  const { game, team } = props;

  const players = game.players.filter(p => p.team === team);
  const [homeGoals, awayGoals] = game.score.split('-').map(Number);
  const isWinner = team === 'home' ? homeGoals > awayGoals : awayGoals > homeGoals;

  return (<div className={`flex flex-col gap-2 items-center ${isWinner ? 'font-bold' : ''}`}>
    {players.map(player => (
      <div key={player.id} className="flex items-center gap-2">
        <UserGames
          key={player.user.id}
          user={player.user}
          bold={isWinner}
        />
      </div>
    ))}
  </div>)
}
