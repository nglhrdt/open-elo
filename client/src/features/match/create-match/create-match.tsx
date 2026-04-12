import { fetchLeagueById, fetchSeasonById } from '@/api/api';
import { useQueries } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { CreateMatchCard } from './create-match-card';
import { CreateMatchDialog } from './create-match-dialog';
import { CreateMatchForm } from './create-match-form';

type CreateMatchProps = {
  leagueId: string;
  seasonId: string;
  onGameCreated?: () => void;
};

export function CreateMatch({
  leagueId,
  seasonId,
  onGameCreated,
}: CreateMatchProps) {
  const [open, setOpen] = useState(false);

  const handleGameCreated = useCallback(() => {
    setOpen(false);
    onGameCreated?.();
  }, [onGameCreated]);

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

  if (!league || !season) return <div>Loading...</div>;

  const isCurrentSeason = league.currentSeason.id === season.id;
  if (!isCurrentSeason) return null;

  return (
    <>
      <div className="md:hidden">
        <CreateMatchDialog open={open} onOpenChange={setOpen}>
          <CreateMatchForm
            leagueId={leagueId}
            seasonId={seasonId}
            onGameCreated={handleGameCreated}
          />
        </CreateMatchDialog>
      </div>
      <div className="hidden md:block">
        <CreateMatchCard>
          <CreateMatchForm
            leagueId={leagueId}
            seasonId={seasonId}
            onGameCreated={handleGameCreated}
          />
        </CreateMatchCard>
      </div>
    </>
  );
}
