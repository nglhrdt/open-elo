import type { Match } from '@/api/api';
import { useMemo } from 'react';
import { MatchTeam } from './match-team';

type MatchListItemProps = { match: Match };

export function MatchListItem(props: MatchListItemProps) {
  const { match } = props;

  const dateString = useMemo(() => {
    const date = new Date(match.createdAt);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [match.createdAt]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <MatchTeam match={match} team="HOME" />
      <div className="flex flex-col items-center justify-center">
        <div className="mb-2 text-xl">{match.score}</div>
        <div className="text-xs text-muted-foreground text-center">
          {dateString}
        </div>
      </div>
      <MatchTeam match={match} team="AWAY" />
    </div>
  );
}
