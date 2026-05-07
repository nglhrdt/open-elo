import { useGetSeasons } from '@/api/hooks/use-seasons';
import { useNavigate } from 'react-router';
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
  playerId,
}: {
  seasonId: string;
  leagueId: string;
  playerId: string;
}) {
  const { data: seasons } = useGetSeasons({ leagueId });

  const navigate = useNavigate();

  function handleSeasonChange(selectedSeasonId: string): void {
    navigate(
      `/leagues/${leagueId}/seasons/${selectedSeasonId}/players/${playerId}`,
    );
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
