import { useGetSeasons } from '@/api/hooks/use-seasons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

export function SeasonSelect({
  seasonId,
  leagueId,
  onSeasonChange,
}: {
  seasonId: string;
  leagueId: string;
  onSeasonChange: (seasonId: string) => void;
}) {
  const { data: seasons } = useGetSeasons({ leagueId });

  function handleSeasonChange(selectedSeasonId: string): void {
    onSeasonChange(selectedSeasonId);
  }

  return (
    <Select value={seasonId} onValueChange={handleSeasonChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select season" />
      </SelectTrigger>
      <SelectContent>
        {seasons?.map((season) => (
          <SelectItem key={season.id} value={season.id}>
            Season {season.seasonNumber}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
