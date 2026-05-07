import { PlayerLeagueSelect } from '@/components/player-league-select';
import { PlayerSelect } from '@/components/player-select';
import { SeasonSelect } from '@/components/season-select';
import { ConvertGuestDialog } from './convert-guest-dialog';
import { DeleteGuestDialog } from './delete-guest-dialog';
import { RenameUserDialog } from './rename-user-dialog';

interface PlayerHeaderProps {
  leagueId: string;
  seasonId: string;
  playerId: string;
}

export function PlayerHeader(props: PlayerHeaderProps) {
  const { leagueId, seasonId, playerId } = props;

  return (
    <div className="flex justify-between gap-4 grow">
      <div className="flex items-center gap-4">
        <PlayerLeagueSelect
          leagueId={leagueId}
          playerId={playerId}
          seasonId={seasonId}
        />
        <SeasonSelect
          leagueId={leagueId}
          seasonId={seasonId}
          playerId={playerId}
        />
        <PlayerSelect
          leagueId={leagueId}
          playerId={playerId}
          seasonId={seasonId}
        />
      </div>
      <div className="flex items-center gap-4">
        <ConvertGuestDialog userId={playerId} />
        <DeleteGuestDialog userId={playerId} />
        <RenameUserDialog userId={playerId} />
      </div>
    </div>
  );
}
