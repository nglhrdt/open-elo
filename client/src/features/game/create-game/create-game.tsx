import { useCallback, useState } from "react";
import { CreateGameCard } from "./create-game-card";
import { CreateGameDialog } from "./create-game-dialog";
import { CreateGameForm } from "./create-game-form";

type CreateGameProps = {
  leagueId: string;
  onGameCreated?: () => void;
}

export function CreateGame(props: CreateGameProps) {
  const { leagueId, onGameCreated } = props;
  const [open, setOpen] = useState(false);

  const handleGameCreated = useCallback(() => {
    setOpen(false);
    onGameCreated?.();
  }, [onGameCreated]);

  return (
    <>
      <div className="md:hidden">
        <CreateGameDialog open={open} onOpenChange={setOpen}>
          <CreateGameForm leagueId={leagueId} onGameCreated={handleGameCreated} />
        </CreateGameDialog>
      </div>
      <div className="hidden md:block">
        <CreateGameCard>
          <CreateGameForm leagueId={leagueId} onGameCreated={handleGameCreated} />
        </CreateGameCard>
      </div>
    </>
  );
}
