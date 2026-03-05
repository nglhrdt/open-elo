import type { League } from '@/api/api';
import { LeagueSelect } from '@/components/league-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PlayerFiltersProps {
  userLeagues: League[];
  selectedLeagueId: string | undefined;
  onLeagueChange: (leagueId: string) => void;
  availableSeasons: number[];
  currentSeasonNumber: number;
  selectedSeason: number | 'all' | 'current';
  onSeasonChange: (season: number | 'all') => void;
}

export function PlayerFilters({
  userLeagues,
  selectedLeagueId,
  onLeagueChange,
  availableSeasons,
  currentSeasonNumber,
  selectedSeason,
  onSeasonChange,
}: PlayerFiltersProps) {
  const seasonSelectValue =
    selectedSeason === 'current' ? currentSeasonNumber.toString() : selectedSeason.toString();

  const handleSeasonChange = (value: string) => {
    if (value === 'all') {
      onSeasonChange('all');
    } else {
      onSeasonChange(parseInt(value));
    }
  };

  return (
    <div className='flex items-center gap-2'>
      {userLeagues.length > 0 && (
        <div className='w-48'>
          <LeagueSelect
            leagues={[{ id: 'all', name: 'All Leagues', type: 'TABLE_SOCCER' }, ...userLeagues]}
            value={selectedLeagueId || 'all'}
            onChange={onLeagueChange}
            placeholder='Filter by league'
          />
        </div>
      )}
      {availableSeasons.length > 0 && (
        <Select value={seasonSelectValue} onValueChange={handleSeasonChange}>
          <SelectTrigger className='w-48'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={currentSeasonNumber.toString()}>
              Season {currentSeasonNumber} (Current)
            </SelectItem>
            {availableSeasons
              .filter(s => s !== currentSeasonNumber)
              .map(season => (
                <SelectItem key={season} value={season.toString()}>
                  Season {season}
                </SelectItem>
              ))}
            <SelectItem value='all'>All Seasons</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
