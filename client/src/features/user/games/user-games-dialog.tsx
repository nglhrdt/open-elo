import type { User } from "@/api/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { UserGameList } from "./user-game-list";

type UserGamesProps = {
  user: User;
  bold?: boolean;
}

export function UserGames(props: UserGamesProps) {
  const { user, bold } = props;
  const [open, setOpen] = useState(false);

  const userUsernameStyle = `${bold ? 'font-extrabold underline' : ''}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">
          <span className={userUsernameStyle}>{user.username}</span>
        </Button>
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
