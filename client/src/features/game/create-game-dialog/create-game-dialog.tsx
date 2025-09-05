import { createGame, getLeagueUsers, type Team } from "@/api/api";
import { LeagueUserSelect } from "@/components/league-user-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SelectGoals } from "./select-goals";

type CreateGameDialogProps = {
  leagueId: string;
}

export function CreateGameDialog(props: CreateGameDialogProps) {
  const queryClient = useQueryClient()

  const { data: users, isPending } = useQuery({
    queryKey: ['league', props.leagueId, 'users'],
    queryFn: () => getLeagueUsers(props.leagueId)
  });

  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] });
      queryClient.invalidateQueries({ queryKey: ['rankings'] });
      setOpen(false);
    },
  })

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [player1, setPlayer1] = useState<string>('');
  const [player2, setPlayer2] = useState<string>('');
  const [player3, setPlayer3] = useState<string>('');
  const [player4, setPlayer4] = useState<string>('');

  async function handleCreateButtonClick() {
    const score = `${homeScore}-${awayScore}`;
    const players = [];

    if (player1) players.push({ id: player1, team: 'home' as Team });
    if (player2) players.push({ id: player2, team: 'home' as Team });
    if (player3) players.push({ id: player3, team: 'away' as Team });
    if (player4) players.push({ id: player4, team: 'away' as Team });

    await mutation.mutateAsync({
      score, players, leagueId: props.leagueId
    })

    setHomeScore(0);
    setAwayScore(0);
    setPlayer1('');
    setPlayer2('');
    setPlayer3('');
    setPlayer4('');
  }

  const selectedIDs = useMemo(() => {
    const ids = [];
    if (player1) ids.push(player1);
    if (player2) ids.push(player2);
    if (player3) ids.push(player3);
    if (player4) ids.push(player4);
    return ids;
  }, [player1, player2, player3, player4]);

  if (isPending || !users) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={users.length < 4}>New Game</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Game</DialogTitle>
          <DialogDescription>
            Select the final score and the players that played the game.
          </DialogDescription>
        </DialogHeader>
        <SelectGoals goals={homeScore} onSelect={setHomeScore} />
        <LeagueUserSelect placeholder="Player 1" value={player1} onChange={setPlayer1} leagueId={props.leagueId} selectedIds={selectedIDs} />
        <LeagueUserSelect placeholder="Player 2" value={player2} onChange={setPlayer2} leagueId={props.leagueId} selectedIds={selectedIDs} />
        <p>Home</p>
        <Separator orientation="horizontal" />
        <p>Away</p>
        <LeagueUserSelect placeholder="Player 3" value={player3} onChange={setPlayer3} leagueId={props.leagueId} selectedIds={selectedIDs} />
        <LeagueUserSelect placeholder="Player 4" value={player4} onChange={setPlayer4} leagueId={props.leagueId} selectedIds={selectedIDs} />
        <SelectGoals goals={awayScore} onSelect={setAwayScore} />
        <DialogFooter>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateButtonClick}>Create Game</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
