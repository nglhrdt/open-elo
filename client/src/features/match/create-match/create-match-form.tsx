import {
  createMatch,
  fetchLeagueById,
  fetchSeasonById,
  type Team,
} from '@/api/api';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { LeagueUserSelect } from './league-user-select';
import { SelectGoals } from './select-goals';

type CreateGameProps = {
  leagueId: string;
  seasonId: string;
  onGameCreated?: () => void;
};

export function CreateMatchForm({
  leagueId,
  seasonId,
  onGameCreated,
}: CreateGameProps) {
  const queryClient = useQueryClient();

  const [{ data: league }, { data: season }] = useQueries({
    queries: [
      {
        queryKey: ['leagues', leagueId],
        queryFn: () => fetchLeagueById(leagueId!),
      },
      {
        queryKey: ['seasons', seasonId],
        queryFn: () => fetchSeasonById(seasonId!),
      },
    ],
  });

  const mutation = useMutation({
    mutationFn: createMatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
      queryClient.invalidateQueries({ queryKey: ['seasons'] });
      queryClient.invalidateQueries({ queryKey: ['leagues'] });

      setHomeScore(0);
      setAwayScore(0);
      setPlayer1('');
      setPlayer2('');
      setPlayer3('');
      setPlayer4('');

      onGameCreated?.();
    },
  });

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [player1, setPlayer1] = useState<string>('');
  const [player2, setPlayer2] = useState<string>('');
  const [player3, setPlayer3] = useState<string>('');
  const [player4, setPlayer4] = useState<string>('');

  async function handleCreateButtonClick() {
    const score = `${homeScore}-${awayScore}`;
    const players = [];

    if (player1) players.push({ id: player1, team: 'HOME' as Team });
    if (player2) players.push({ id: player2, team: 'HOME' as Team });
    if (player3) players.push({ id: player3, team: 'AWAY' as Team });
    if (player4) players.push({ id: player4, team: 'AWAY' as Team });

    await mutation.mutateAsync({
      score,
      players,
      seasonId,
    });
  }

  const selectedIDs = useMemo(() => {
    const ids = [];
    if (player1) ids.push(player1);
    if (player2) ids.push(player2);
    if (player3) ids.push(player3);
    if (player4) ids.push(player4);
    return ids;
  }, [player1, player2, player3, player4]);

  if (!league || !season) return null;
  if (league.members.length < 4)
    return (
      <p className="text-muted-foreground">Not enough members in the league</p>
    );

  return (
    <div className="flex flex-col gap-4">
      <p>Home</p>
      <SelectGoals goals={homeScore} onSelect={setHomeScore} />
      <LeagueUserSelect
        placeholder="Player 1"
        value={player1}
        onChange={setPlayer1}
        leagueId={leagueId}
        selectedIds={selectedIDs}
      />
      <LeagueUserSelect
        placeholder="Player 2"
        value={player2}
        onChange={setPlayer2}
        leagueId={leagueId}
        selectedIds={selectedIDs}
      />
      <Separator orientation="horizontal" />
      <p>Away</p>
      <LeagueUserSelect
        placeholder="Player 3"
        value={player3}
        onChange={setPlayer3}
        leagueId={leagueId}
        selectedIds={selectedIDs}
      />
      <LeagueUserSelect
        placeholder="Player 4"
        value={player4}
        onChange={setPlayer4}
        leagueId={leagueId}
        selectedIds={selectedIDs}
      />
      <SelectGoals goals={awayScore} onSelect={setAwayScore} />
      <Button
        disabled={selectedIDs.length < 4}
        onClick={handleCreateButtonClick}
      >
        Create Game
      </Button>
    </div>
  );
}
