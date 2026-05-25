import { useGetSeasonById } from '@/api/hooks/use-seasons';
import { useCallback, useState } from 'react';
import { CreateMatchCard } from './create-match-card';
import { CreateMatchDialog } from './create-match-dialog';
import { CreateMatchForm } from './create-match-form';

type CreateMatchProps = {
  seasonId: string;
  onGameCreated?: () => void;
};

export function CreateMatch({ seasonId, onGameCreated }: CreateMatchProps) {
  const { data: season } = useGetSeasonById(seasonId);

  const [open, setOpen] = useState(false);

  const handleGameCreated = useCallback(() => {
    setOpen(false);
    onGameCreated?.();
  }, [onGameCreated]);

  if (!season?.isCurrentSeason) return null;

  return (
    <>
      <div className="md:hidden">
        <CreateMatchDialog open={open} onOpenChange={setOpen}>
          <CreateMatchForm
            seasonId={seasonId}
            onGameCreated={handleGameCreated}
          />
        </CreateMatchDialog>
      </div>
      <div className="hidden md:block">
        <CreateMatchCard>
          <CreateMatchForm
            seasonId={seasonId}
            onGameCreated={handleGameCreated}
          />
        </CreateMatchCard>
      </div>
    </>
  );
}
