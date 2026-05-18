import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FavoriteTeamMateProps = {
  playerId: string;
  seasonId: string;
};

function FavoriteTeamMate({ playerId, seasonId }: FavoriteTeamMateProps) {
  const { data: stats } = useGetUserSeasonStats(playerId, seasonId);

  return (
    <Card className="aspect-video">
      <CardHeader>
        <CardTitle>Favorite Team Mate</CardTitle>
      </CardHeader>
      <CardContent>{stats?.summary.with.mostWins?.username}</CardContent>
    </Card>
  );
}

export default FavoriteTeamMate;
