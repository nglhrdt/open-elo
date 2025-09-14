import type { Ranking } from '@/api/api';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CreateGameDialog } from '../game/create-game/create-game-dialog';
import { LeagueTable } from './league-table';

export function UserRanking(props: { ranking: Ranking }) {
  const { ranking } = props;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{ranking.league.name}</CardTitle>
        <CardAction>
          <CreateGameDialog />
        </CardAction>
      </CardHeader>
      <CardContent>
        <LeagueTable ranking={ranking} />
      </CardContent>
    </Card>
  );
}
