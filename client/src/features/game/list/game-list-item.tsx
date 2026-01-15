import type { Game } from "@/api/api";
import { useMemo } from "react";
import { GameTeam } from "./game-team";

type GameListItemProps = { game: Game; leagueId?: string }

export function GameListItem(props: GameListItemProps) {
  const { game, leagueId } = props;

  const dateString = useMemo(() => {
    const date = new Date(game.createdAt);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [game.createdAt]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <GameTeam game={game} team={'home'} leagueId={leagueId} />
      <div className="flex flex-col items-center justify-center">
        <div className="mb-2 text-xl">{game.score}</div>
        <div className="text-xs text-muted-foreground text-center">{dateString}</div>
      </div>
      <GameTeam game={game} team={'away'} leagueId={leagueId} />
    </div>
  );
}
