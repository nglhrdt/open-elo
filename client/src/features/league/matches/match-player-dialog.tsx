import UserAvatar from '@/components/user-avatar';
import { Link } from 'react-router';

type MatchPlayerDialogProps = {
  playerId: string;
  leagueId: string;
  seasonId: string;
};

export function MatchPlayerDialog(props: MatchPlayerDialogProps) {
  const { leagueId, seasonId, playerId } = props;

  const playerUrl = `/leagues/${leagueId}/seasons/${seasonId}/players/${playerId}`;

  return (
    <Link to={playerUrl}>
      <UserAvatar userId={playerId} size="size-8" showName />
    </Link>
  );
}
