import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FavoriteOpponentProps = {
  playerId: string;
  seasonId: string;
};

function FavoriteOpponent({ playerId, seasonId }: FavoriteOpponentProps) {
  const { data: stats } = useGetUserSeasonStats(playerId, seasonId);
  return (
    <Card className="aspect-video">
      <CardHeader>
        <CardTitle>Favorite Opponent</CardTitle>
      </CardHeader>
      <CardContent>{stats?.summary.against.mostWins?.username}</CardContent>
    </Card>
  );
}

export default FavoriteOpponent;
