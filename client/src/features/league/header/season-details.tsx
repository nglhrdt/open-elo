import { useGetSeasonById } from '@/api/hooks/use-seasons';
import type { Season } from '@open-elo/shared';

export function SeasonDetails({
  seasonId,
}: {
  leagueId: string;
  seasonId: string;
}) {
  const { data: season } = useGetSeasonById(seasonId);
  if (!season) return null;

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

  return (
    <p className="text-sm text-muted-foreground">
      Season {season.seasonNumber}
      {season.isCurrentSeason &&
        season.endAt &&
        daysRemaining !== null &&
        daysRemaining > 0 && (
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
  );
}
