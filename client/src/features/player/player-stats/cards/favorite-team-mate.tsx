import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <Avatar className="aspect-square w-32 h-32">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>{stats?.summary.with.mostWins?.username}</div>
        <div>{stats?.summary.with.mostWins?.count}</div>
      </CardContent>
    </Card>
  );
}

export default FavoriteTeamMate;
