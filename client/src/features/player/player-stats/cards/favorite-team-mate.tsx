import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserAvatar from '@/components/user-avatar';

type FavoriteTeamMateProps = {
  playerId: string;
  seasonId: string;
};

function FavoriteTeamMate({ playerId, seasonId }: FavoriteTeamMateProps) {
  const { data: stats } = useGetUserSeasonStats(playerId, seasonId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most wins with</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {stats?.summary.with.mostWins ? (
          <>
            <UserAvatar userId={stats.summary.with.mostWins.userId} size="size-32" />
            <div>{stats.summary.with.mostWins.username}</div>
            <div>{stats.summary.with.mostWins.count}</div>
          </>
        ) : (
          <div>No data</div>
        )}
      </CardContent>
    </Card>
  );
}

export default FavoriteTeamMate;
