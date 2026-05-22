import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import { Card, CardContent } from '@/components/ui/card';

type SeasonEloProps = {
  playerId: string;
  seasonId: string;
};

function SeasonElo({ playerId, seasonId }: SeasonEloProps) {
  const { data: stats } = useGetUserSeasonStats(playerId, seasonId);

  return (
    <Card>
      <CardContent className="flex-1 pb-0 flex flex-col items-center justify-center gap-4">
        <div className="text-2xl font-bold">Position</div>
        <div className="text-9xl font-bold">{stats?.position ?? 0}</div>
        <div className="text-xl font-bold">{stats?.elo ?? 0} Elo</div>
      </CardContent>
    </Card>
  );
}

export default SeasonElo;
