import { CreateGameCard } from "./create-game-card";
import { CreateGameDialog } from "./create-game-dialog";
import { CreateGameForm } from "./create-game-form";

type CreateGameProps = {
  leagueId: string;
  onGameCreated?: () => void;
}

export function CreateGame(props: CreateGameProps) {
  const { leagueId, onGameCreated } = props;

  return (
    <>
      <div className="md:hidden">
        <CreateGameDialog>
          <CreateGameForm leagueId={leagueId} onGameCreated={onGameCreated} />
        </CreateGameDialog>
      </div>
      <div className="hidden md:block">
        <CreateGameCard>
          <CreateGameForm leagueId={leagueId} onGameCreated={onGameCreated} />
        </CreateGameCard>
      </div>
    </>
  );
}
