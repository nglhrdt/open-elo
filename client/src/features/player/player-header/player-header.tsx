import { PlayerLeagueSelect } from '@/components/player-league-select';
import { PlayerSelect } from '@/components/player-select';
import { SeasonSelect } from '@/components/season-select';
import { useNavigate } from 'react-router';
import { ConvertGuestDialog } from './convert-guest-dialog';
import { DeleteGuestDialog } from './delete-guest-dialog';

interface PlayerHeaderProps {
  leagueId: string;
  seasonId: string;
  playerId: string;
}

export function PlayerHeader(props: PlayerHeaderProps) {
  const { leagueId, seasonId, playerId } = props;

  const navigate = useNavigate();

  function handleSeasonChange(selectedSeasonId: string): void {
    navigate(
      `/leagues/${leagueId}/seasons/${selectedSeasonId}/players/${playerId}`,
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <PlayerLeagueSelect
          leagueId={leagueId}
          playerId={playerId}
          seasonId={seasonId}
        />
        <SeasonSelect
          leagueId={leagueId}
          seasonId={seasonId}
          onSeasonChange={handleSeasonChange}
        />
        <PlayerSelect
          leagueId={leagueId}
          playerId={playerId}
          seasonId={seasonId}
        />
      </div>
      <ConvertGuestDialog userId={playerId} />
      <DeleteGuestDialog userId={playerId} />
    </div>
  );
}
