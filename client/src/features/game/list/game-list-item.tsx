import type { Game } from "@/api/api";
import { Card } from "@/components/ui/card";

export function GameListItem(props: { game: Game }) {
    const { game } = props;

    return (
        <Card>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2 items-center">
                    {game.players.filter(player => player.team === 'home').map(player => (
                        <div key={player.id} className="flex items-center gap-2">
                            <span className="font-bold">{player.user.username}</span>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col items-center justify-center">
                    {game.score}
                </div>
                <div className="flex flex-col gap-2 items-center">
                    {game.players.filter(player => player.team === 'away').map(player => (
                        <div key={player.id} className="flex items-center gap-2">
                            <span className="font-bold">{player.user.username}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
