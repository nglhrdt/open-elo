import { PlayerMatchesSection } from '@/features/user/player-games-section/player-games-section';
import { PlayerHeader } from '@/features/user/player-header/player-header';
import { useParams } from 'react-router';

export function PlayerPage() {
  const { leagueId, seasonId, playerId } = useParams<{
    leagueId: string;
    seasonId: string;
    playerId: string;
  }>();

  if (!playerId || !leagueId || !seasonId) return <div>Params missing</div>;

  return (
    <div className="flex flex-col gap-6 grow shrink">
      <div className="flex items-center justify-between gap-4 lg:gap-8 shrink-0">
        <PlayerHeader userId={playerId} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <PlayerMatchesSection
          playerId={playerId}
          leagueId={leagueId}
          seasonId={seasonId}
        />
      </div>
    </div>
  );
}
