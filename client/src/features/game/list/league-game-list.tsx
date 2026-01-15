import { getLeagueGames } from "@/api/api";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react/jsx-runtime";
import { GameListItem } from "./game-list-item";

type LeagueGameListProps = {
  leagueId: string;
  count?: number;
}

export function LeagueGameList(props: LeagueGameListProps) {
  const { leagueId, count = 10 } = props;
  const { data: games } = useQuery({
    queryKey: ['games', leagueId, count],
    queryFn: () => getLeagueGames(leagueId, { count })
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      {games?.map((game, i) => {
        return (
          <Fragment key={game.id}>
            <GameListItem key={game.id} game={game} leagueId={leagueId} />
            {i < games.length - 1 && <Separator orientation="horizontal" />}
          </Fragment>
        )
      })}
    </div>
  );
}
