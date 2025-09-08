import type { Ranking } from '@/api/api';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreateGameDialog } from '../game/create-game-dialog/create-game-dialog';
import { LeagueTable } from './league-table';

export function UserRanking(props: { ranking: Ranking }) {
  const { ranking } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ranking.league.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <LeagueTable ranking={ranking} />
      </CardContent>
      <CardFooter className="flex justify-end">
        <CreateGameDialog leagueId={ranking.league.id} />
      </CardFooter>
    </Card>
  );
}
