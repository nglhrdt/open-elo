import { type League, type Season } from '@/api/api';
import { useNavigate } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

export function SeasonSelector({
  league,
  selectedSeason,
}: {
  league: League;
  selectedSeason: Season;
}) {
  const navigate = useNavigate();
  const handleSeasonChange = (seasonId: string) => {
    navigate(`/leagues/${league.id}/seasons/${seasonId}`);
  };

  if (!selectedSeason) return null;

  return (
    <Select
      value={selectedSeason.id}
      onValueChange={(value) => handleSeasonChange(value)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select season" />
      </SelectTrigger>
      <SelectContent>
        {league.seasons.map((season) => (
          <SelectItem key={season.id} value={season.id}>
            Season {season.seasonNumber}
            {season.id === league.currentSeason.id && ' (Current)'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
