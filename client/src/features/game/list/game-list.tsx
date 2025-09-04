import { getGames } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { GameListItem } from "./game-list-item";

export function GameList() {
    const { data: games } = useQuery({ queryKey: ['games'], queryFn: getGames });

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 flex flex-col gap-4">
            <h2>Game List</h2>
            {games?.map(game => <GameListItem key={game.id} game={game} />)}
        </div>
    );
}
