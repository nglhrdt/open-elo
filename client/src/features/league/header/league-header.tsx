import { fetchLeagueById, fetchSeasonById, type Season } from '@/api/api';
import { useQueries } from '@tanstack/react-query';
import { SeasonSelector } from './season-selector';

export function LeagueHeader({
  leagueId,
  seasonId,
}: {
  leagueId: string;
  seasonId: string;
}) {
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

  // Calculate days remaining until season ends
  const getDaysRemaining = (season: Season) => {
    if (!season.endAt) return null;
    const endDate = new Date(season.endAt);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(season);
  const showSeasonsOptions =
    league.seasons.length > 1 ||
    (league.seasons.length === 1 && !!season.endAt);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">{league.name}</h1>
        {showSeasonsOptions && (
          <SeasonSelector league={league} selectedSeason={season} />
        )}
      </div>
      {showSeasonsOptions && (
        <p className="text-sm text-muted-foreground">
          Season {season.seasonNumber}
          {league.currentSeason.id === season.id && season.endAt && (
            <>
              {' • Ends '}
              {new Date(season.endAt).toLocaleDateString()}
              {daysRemaining !== null && (
                <span
                  className={
                    daysRemaining <= 7 ? 'text-orange-500 font-medium' : ''
                  }
                >
                  {' '}
                  ({daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left)
                </span>
              )}
            </>
          )}
        </p>
      )}
    </div>
  );
}
