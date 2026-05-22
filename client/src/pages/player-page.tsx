import { PlayerHeader } from '@/features/player/player-header/player-header';
import { PlayerMatches } from '@/features/player/player-matches/player-matches';
import PlayerStats from '@/features/player/player-stats/player-stats';
import PlayerWinLoose from '@/features/player/player-win-loose/player-win-loose';
import { useParams } from 'react-router';

export function PlayerPage() {
  const { leagueId, seasonId, playerId } = useParams<{
    leagueId: string;
    seasonId: string;
    playerId: string;
  }>();

  if (!playerId || !leagueId || !seasonId) return <div>Params missing</div>;

  return (
    <div className="flex flex-col gap-4 grow shrink">
      <div className="flex items-center justify-between gap-4 lg:gap-8 shrink-0">
        <PlayerHeader
          leagueId={leagueId}
          seasonId={seasonId}
          playerId={playerId}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <PlayerStats seasonId={seasonId} playerId={playerId} />
        <PlayerWinLoose seasonId={seasonId} playerId={playerId} />
        <PlayerMatches seasonId={seasonId} playerId={playerId} />
      </div>
    </div>
  );
}
