import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserAvatar from '@/components/user-avatar';

type FavoriteOpponentProps = {
  playerId: string;
  seasonId: string;
};

function FavoriteOpponent({ playerId, seasonId }: FavoriteOpponentProps) {
  const { data: stats } = useGetUserSeasonStats(playerId, seasonId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most wins against</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {stats?.summary.against.mostWins ? (
          <>
            <UserAvatar
              userId={stats.summary.against.mostWins.userId}
              size="size-32"
            />
            <div>{stats.summary.against.mostWins.username}</div>
            <div>{stats.summary.against.mostWins.count}</div>
          </>
        ) : (
          <div>No data</div>
        )}
      </CardContent>
    </Card>
  );
}

export default FavoriteOpponent;
