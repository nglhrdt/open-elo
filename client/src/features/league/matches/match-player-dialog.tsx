import { Button } from '@/components/ui/button';
import { Link } from 'react-router';

type MatchPlayerDialogProps = {
  playerId: string;
  playername: string;
  bold?: boolean;
  leagueId: string;
  seasonId: string;
};

export function MatchPlayerDialog(props: MatchPlayerDialogProps) {
  const { bold, leagueId, seasonId, playerId, playername } = props;

  const userUsernameStyle = `${bold ? 'font-extrabold underline' : ''}`;
  const playerUrl = `/leagues/${leagueId}/seasons/${seasonId}/players/${playerId}`;

  return (
    <Link to={playerUrl}>
      <Button variant="link">
        <span className={userUsernameStyle}>{playername}</span>
      </Button>
    </Link>
  );
}
