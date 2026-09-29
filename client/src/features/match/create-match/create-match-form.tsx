import {
  useCreateSeasonMatch,
  useGetSeasonById,
} from '@/api/hooks/use-seasons';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Team } from '@open-elo/shared';
import { useEffect, useMemo, useState } from 'react';
import { LeagueUserSelect } from './league-user-select';
import { SelectGoals } from './select-goals';

type CreateGameProps = {
  seasonId: string;
  showPositions?: boolean;
  onGameCreated?: () => void;
  randomPlayers?: string[];
};

export function CreateMatchForm({
  seasonId,
  showPositions,
  onGameCreated,
  randomPlayers,
}: CreateGameProps) {
  const { data: season } = useGetSeasonById(seasonId);
  const createSeasonMatch = useCreateSeasonMatch();

  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [player1, setPlayer1] = useState<string>('');
  const [player2, setPlayer2] = useState<string>('');
  const [player3, setPlayer3] = useState<string>('');
  const [player4, setPlayer4] = useState<string>('');

  useEffect(() => {
    if (!randomPlayers || randomPlayers.length < 4) return;

    setPlayer1(randomPlayers[0]);
    setPlayer2(randomPlayers[1]);
    setPlayer3(randomPlayers[2]);
    setPlayer4(randomPlayers[3]);
  }, [randomPlayers]);

  async function handleCreateButtonClick() {
    const score = `${homeScore}-${awayScore}`;
    const players = [];

    if (player1) players.push({ id: player1, team: 'HOME' as Team });
    if (player2) players.push({ id: player2, team: 'HOME' as Team });
    if (player3) players.push({ id: player3, team: 'AWAY' as Team });
    if (player4) players.push({ id: player4, team: 'AWAY' as Team });

    createSeasonMatch.mutate({
      score,
      players,
      seasonId,
    });

    setHomeScore(0);
    setAwayScore(0);
    setPlayer1('');
    setPlayer2('');
    setPlayer3('');
    setPlayer4('');

    onGameCreated?.();
  }

  const selectedIDs = useMemo(() => {
    const ids = [];
    if (player1) ids.push(player1);
    if (player2) ids.push(player2);
    if (player3) ids.push(player3);
    if (player4) ids.push(player4);
    return ids;
  }, [player1, player2, player3, player4]);

  if (!season) return null;

  return (
    <div className="flex flex-col gap-4">
      <p>Home / White</p>
      <SelectGoals goals={homeScore} onSelect={setHomeScore} />
      <LeagueUserSelect
        placeholder="Player 1"
        value={player1}
        onChange={setPlayer1}
        leagueId={season.league.id}
        selectedIds={selectedIDs}
        position={showPositions ? 'Defense' : undefined}
      />
      <LeagueUserSelect
        placeholder="Player 2"
        value={player2}
        onChange={setPlayer2}
        leagueId={season.league.id}
        selectedIds={selectedIDs}
        position={showPositions ? 'Offense' : undefined}
      />
      <Separator orientation="horizontal" />
      <p>Away / Black</p>
      <LeagueUserSelect
        placeholder="Player 3"
        value={player3}
        onChange={setPlayer3}
        leagueId={season.league.id}
        selectedIds={selectedIDs}
        position={showPositions ? 'Defense' : undefined}
      />
      <LeagueUserSelect
        placeholder="Player 4"
        value={player4}
        onChange={setPlayer4}
        leagueId={season.league.id}
        selectedIds={selectedIDs}
        position={showPositions ? 'Offense' : undefined}
      />
      <SelectGoals goals={awayScore} onSelect={setAwayScore} />
      <Button
        disabled={selectedIDs.length < 4 || (homeScore === 0 && awayScore === 0)}
        onClick={handleCreateButtonClick}
      >
        Create Game
      </Button>
    </div>
  );
}
