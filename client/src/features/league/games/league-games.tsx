import { GameListCard } from "@/features/game/list/game-list-card";
import { GameListDialog } from "@/features/game/list/game-list-dialog";
import { LeagueGameList } from "@/features/game/list/league-game-list";

export function LeagueGames(props: { leagueId: string; seasonNumber?: number }) {
  const { leagueId, seasonNumber } = props;

  return (
    <>
      <div className="md:hidden">
        <GameListDialog>
          <LeagueGameList leagueId={leagueId} count={3} seasonNumber={seasonNumber} />
        </GameListDialog>
      </div>
      <div className="hidden md:block">
        <GameListCard>
          <LeagueGameList leagueId={leagueId} count={3} seasonNumber={seasonNumber} />
        </GameListCard>
      </div>
    </>
  )
}
