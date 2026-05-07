import { SeasonMatchList } from './season-match-list';
import { MatchListCard } from './match-list-card';
import { MatchListDialog } from './match-list-dialog';

export function SeasonMatches(props: { seasonId: string }) {
  const { seasonId } = props;

  return (
    <>
      <div className="md:hidden">
        <MatchListDialog>
          <SeasonMatchList count={3} seasonId={seasonId} />
        </MatchListDialog>
      </div>
      <div className="hidden md:block">
        <MatchListCard>
          <SeasonMatchList count={3} seasonId={seasonId} />
        </MatchListCard>
      </div>
    </>
  );
}
