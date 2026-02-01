import { getUserGames } from "@/api/api";
import { Separator } from "@/components/ui/separator";
import { GameListItem } from "@/features/game/list/game-list-item";
import { useQuery } from "@tanstack/react-query";
import { Fragment } from "react/jsx-runtime";

type UserGameListProps = {
  userId: string;
  count?: number;
}

export function UserGameList(props: UserGameListProps) {
  const { userId, count = 10 } = props;
  const { isPending, data: gamesResponse } = useQuery({
    queryKey: ['games', userId, count],
    queryFn: () => getUserGames(userId, { count })
  });

  const games = gamesResponse?.data || [];

  if (isPending) return <div>Loading...</div>;
  if (!games || games.length === 0) return <div className="p-8 text-center">No games found</div>;

  return (
    <div className="flex flex-col gap-8 w-full">
      {games?.map((game, i) => {
        return (
          <Fragment key={game.id}>
            <GameListItem key={game.id} game={game} />
            {i < games.length - 1 && <Separator orientation="horizontal" />}
          </Fragment>
        )
      })}
    </div>
  );
}
