import { useGetSeasonById } from '@/api/hooks/use-seasons';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCallback, useState } from 'react';
import { ChooseRandomPlayers } from './choose-random-players';
import { CreateMatchDialog } from './create-match-dialog';
import { CreateMatchForm } from './create-match-form';

type CreateMatchProps = {
  seasonId: string;
  onGameCreated?: () => void;
};

export function CreateMatch({ seasonId, onGameCreated }: CreateMatchProps) {
  const { data: season } = useGetSeasonById(seasonId);

  const [open, setOpen] = useState(false);
  const [randomPlayers, setRandomPlayers] = useState<string[]>();

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
            randomPlayers={randomPlayers}
          />
        </CreateMatchDialog>
      </div>
      <div className="hidden md:block">
        <Card>
          <CardHeader>
            <CardTitle>Create Match</CardTitle>
            <CardDescription>
              Create a new match by selecting the players and final score.
            </CardDescription>
            <CardAction>
              {season && (
                <ChooseRandomPlayers
                  seasonId={season.id}
                  onRandomized={(players) => setRandomPlayers([...players])}
                />
              )}
            </CardAction>
          </CardHeader>
          <CardContent>
            <CreateMatchForm
              seasonId={seasonId}
              onGameCreated={handleGameCreated}
              randomPlayers={randomPlayers}
              showPositions
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
