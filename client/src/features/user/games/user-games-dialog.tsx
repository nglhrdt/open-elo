import type { User } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Link } from "react-router";
import { UserGameList } from "./user-game-list";

type UserGamesProps = {
  user: User;
  bold?: boolean;
  leagueId?: string;
}

export function UserGames(props: UserGamesProps) {
  const { user, bold, leagueId } = props;
  const [open, setOpen] = useState(false);

  const userUsernameStyle = `${bold ? 'font-extrabold underline' : ''}`;
  const playerUrl = leagueId ? `/players/${user.id}?leagueId=${leagueId}` : `/players/${user.id}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Link to={playerUrl}>
          <Button variant="link">
            <span className={userUsernameStyle}>{user.username}</span>
          </Button>
        </Link>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user.username}'s last games</DialogTitle>
          <UserGameList count={3} userId={user.id} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
