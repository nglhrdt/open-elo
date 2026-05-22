import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
        <Avatar className="aspect-square w-32 h-32">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>{stats?.summary.against.mostWins?.username}</div>
        <div>{stats?.summary.against.mostWins?.count}</div>
      </CardContent>
    </Card>
  );
}

export default FavoriteOpponent;
