import { LeagueMatchList } from './league-match-list';
import { MatchListCard } from './match-list-card';
import { MatchListDialog } from './match-list-dialog';

export function LeagueMatches(props: { leagueId: string; seasonId: string }) {
  const { leagueId, seasonId } = props;

  return (
    <>
      <div className="md:hidden">
        <MatchListDialog>
          <LeagueMatchList leagueId={leagueId} count={3} seasonId={seasonId} />
        </MatchListDialog>
      </div>
      <div className="hidden md:block">
        <MatchListCard>
          <LeagueMatchList leagueId={leagueId} count={3} seasonId={seasonId} />
        </MatchListCard>
      </div>
    </>
  );
}
