import type { User } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

type UserGamesProps = {
  user: User;
  bold?: boolean;
  leagueId?: string;
}

export function UserGames(props: UserGamesProps) {
  const { user, bold, leagueId } = props;

  const userUsernameStyle = `${bold ? 'font-extrabold underline' : ''}`;
  const playerUrl = leagueId ? `/players/${user.id}?leagueId=${leagueId}` : `/players/${user.id}`;

  return (
    <Link to={playerUrl} className="cursor-pointer">
      <Button variant="link">
        <span className={userUsernameStyle}>{user.username}</span>
      </Button>
    </Link>
  )
}
