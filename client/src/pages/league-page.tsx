import { LeagueHeader } from '@/features/league/header/league-header';
import { JoinLeagueButton } from '@/features/league/join/join-league-button';
import { SeasonMatches } from '@/features/league/matches/season-matches';
import LeagueMembersDialog from '@/features/league/members/league-members-dialog';
import { SeasonSettingsDialog } from '@/features/league/settings/season-settings-dialog';
import { SeasonTable } from '@/features/league/table/season-table';
import { CreateMatch } from '@/features/match/create-match/create-match';
import { useParams } from 'react-router';

export function LeaguePage() {
  const { leagueId, seasonId } = useParams<{
    leagueId: string;
    seasonId: string;
  }>();

  if (!leagueId || !seasonId) return <div>League or season not found</div>;

  return (
    <div className="flex flex-col gap-4 grow shrink">
      <div className="flex items-center justify-between gap-4 lg:gap-8 shrink-0">
        <LeagueHeader leagueId={leagueId} seasonId={seasonId} />
        <div className="flex items-center gap-4">
          <JoinLeagueButton leagueId={leagueId} />
          <LeagueMembersDialog leagueId={leagueId} />
          <SeasonSettingsDialog leagueId={leagueId} />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-12 items-start">
        <SeasonTable seasonId={seasonId} />
        <SeasonMatches seasonId={seasonId} />
        <CreateMatch seasonId={seasonId} />
      </div>
    </div>
  );
}
