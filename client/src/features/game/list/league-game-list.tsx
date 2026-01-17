import { deleteGame, getLeagueGames } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, AlertTriangle } from "lucide-react";
import { Fragment, useState } from "react";
import { GameListItem } from "./game-list-item";

type LeagueGameListProps = {
  leagueId: string;
  count?: number;
}

export function LeagueGameList(props: LeagueGameListProps) {
  const { leagueId, count = 10 } = props;
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);

  const { data: games } = useQuery({
    queryKey: ['games', leagueId, count],
    queryFn: () => getLeagueGames(leagueId, { count })
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['games'] });
      await queryClient.invalidateQueries({ queryKey: ['rankings'] });
      await queryClient.invalidateQueries({ queryKey: ['leagueRankings', leagueId] });
      await queryClient.refetchQueries({ queryKey: ['rankings'] });
      await queryClient.refetchQueries({ queryKey: ['leagueRankings', leagueId] });
      setDeleteDialogOpen(false);
      setGameToDelete(null);
    },
  });

  const handleDeleteClick = (gameId: string) => {
    setGameToDelete(gameId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (gameToDelete) {
      await deleteMutation.mutateAsync(gameToDelete);
    }
  };

  const lastGame = games?.[0];
  const playersInfo = lastGame?.players
    ? `${lastGame.players.filter(p => p.team === 'home').map(p => p.user.username).join(' & ')} vs ${lastGame.players.filter(p => p.team === 'away').map(p => p.user.username).join(' & ')}`
    : '';

  return (
    <>
      <div className="flex flex-col gap-8 w-full">
        {games?.map((game, i) => {
          const isLastGame = i === 0; // Assuming games are sorted with most recent first
          return (
            <Fragment key={game.id}>
              <div className="flex flex-col gap-2">
                <GameListItem key={game.id} game={game} leagueId={leagueId} />
                {isLastGame && (
                  <div className="flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(game.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              {i < games.length - 1 && <Separator orientation="horizontal" />}
            </Fragment>
          )
        })}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Game
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this game?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">Game Details:</p>
                <p className="text-muted-foreground">{playersInfo}</p>
                <p className="text-muted-foreground">Score: {lastGame?.score}</p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="font-semibold text-foreground">What will happen:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                  <li>The game will be permanently deleted</li>
                  <li>All players' ELO ratings will be reverted to their values before this game</li>
                  <li>League rankings will be recalculated</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Game'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
