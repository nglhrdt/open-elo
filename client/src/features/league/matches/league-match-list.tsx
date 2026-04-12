import { fetchSeasonMatches } from '@/api/api';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import { MatchListItem } from './match-list-item';

type LeagueMatchListProps = {
  leagueId: string;
  seasonId: string;
  count?: number;
};

export function LeagueMatchList(props: LeagueMatchListProps) {
  const { leagueId, count = 10, seasonId } = props;

  const { data: matches } = useQuery({
    queryKey: ['leagues', leagueId, 'seasons', seasonId, 'matches', count],
    queryFn: () => fetchSeasonMatches(seasonId, { count }),
  });

  if (!matches || matches.length === 0) {
    return <p className="text-sm text-muted-foreground">No matches found.</p>;
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {matches?.map((match, i) => {
        return (
          <Fragment key={match.id}>
            <div className="flex flex-col gap-2">
              <MatchListItem key={match.id} match={match} />
            </div>
            {i < matches.length - 1 && <Separator orientation="horizontal" />}
          </Fragment>
        );
      })}
    </div>
  );
}
