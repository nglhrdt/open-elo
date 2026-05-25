import { LeagueName } from '@/components/league-name';
import { SeasonSelect } from '@/components/season-select';
import { useNavigate } from 'react-router';
import { SeasonDetails } from './season-details';

export function LeagueHeader({
  leagueId,
  seasonId,
}: {
  leagueId: string;
  seasonId: string;
}) {
  const navigate = useNavigate();

  const handleSeasonChange = (selectedSeasonId: string) => {
    navigate(`/leagues/${leagueId}/seasons/${selectedSeasonId}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <LeagueName leagueId={leagueId} />
        <SeasonSelect
          seasonId={seasonId}
          leagueId={leagueId}
          onSeasonChange={handleSeasonChange}
        />
      </div>
      <SeasonDetails leagueId={leagueId} seasonId={seasonId} />
    </div>
  );
}
