import type { User } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

type MatchPlayerDialogProps = {
  user: User;
  bold?: boolean;
  leagueId: string;
  seasonId: string;
};

export function MatchPlayerDialog(props: MatchPlayerDialogProps) {
  const { bold, leagueId, seasonId, user } = props;

  const userUsernameStyle = `${bold ? 'font-extrabold underline' : ''}`;
  const playerUrl = `/leagues/${leagueId}/seasons/${seasonId}/player/${user.id}`;

  return (
    <Link to={playerUrl}>
      <Button variant="link">
        <span className={userUsernameStyle}>{user.username}</span>
      </Button>
    </Link>
  );
}
