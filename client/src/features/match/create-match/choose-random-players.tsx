import { useGetSeasonById } from '@/api/hooks/use-seasons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Dices } from 'lucide-react';
import { useState } from 'react';
import { RandomPlayersGrid } from './select-random-players/random-players-grid';

type ChooseRandomPlayersProps = {
  seasonId: string;
  onRandomized?: (selectedPlayers: string[]) => void;
};

export function ChooseRandomPlayers({
  seasonId,
  onRandomized,
}: ChooseRandomPlayersProps) {
  const { data: season } = useGetSeasonById(seasonId);
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const handleSelectedPlayers = () => {
    onRandomized?.(selectedPlayers.sort(() => 0.5 - Math.random()).slice(0, 4));
    setSelectedPlayers([]);
  };

  if (!season) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Dices />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4 flex flex-col gap-4">
        <DialogTitle>Create Match from random players</DialogTitle>
        <DialogDescription>
          Select Players to generate a match from. They will be randomly
          assigned to teams. Select at least 4 players. If you select more we
          will select 4 of them.
        </DialogDescription>
        <RandomPlayersGrid
          leagueId={season.league.id}
          selectedPlayers={selectedPlayers}
          setSelectedPlayers={setSelectedPlayers}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              onClick={handleSelectedPlayers}
              disabled={selectedPlayers.length < 4}
            >
              Generate Random Match
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
