import { GameListCard } from "@/features/game/list/game-list-card";
import { GameListDialog } from "@/features/game/list/game-list-dialog";
import { LeagueGameList } from "@/features/game/list/league-game-list";

export function LeagueGames(props: { leagueId: string }) {
  const { leagueId } = props;

  return (
    <>
      <div className="md:hidden">
        <GameListDialog>
          <LeagueGameList leagueId={leagueId} count={3} />
        </GameListDialog>
      </div>
      <div className="hidden md:block">
        <GameListCard>
          <LeagueGameList leagueId={leagueId} count={3} />
        </GameListCard>
      </div>
    </>
  )
}
