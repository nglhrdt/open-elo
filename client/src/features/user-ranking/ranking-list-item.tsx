import type { Ranking } from "@/api/api";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreateGameDialog } from "../game/create-game-dialog/create-game-dialog";

export function RankingListItem(props: { ranking: Ranking }) {
  const { ranking } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ranking.league.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <Label>Position:</Label>
          <div>{ranking.position}</div>
          <Label>Elo:</Label>
          <div>{ranking.elo}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <CreateGameDialog leagueId={ranking.league.id} />
      </CardFooter>
    </Card>
  );
}
