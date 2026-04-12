import { fetchLeagueById } from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

interface PlayerMatchesSectionProps {
  playerId: string;
  seasonId: string;
  leagueId: string;
}

export function PlayerMatchesSection({
  playerId,
  seasonId,
  leagueId,
}: PlayerMatchesSectionProps) {
  const { data: league } = useQuery({
    queryKey: ['leagues', leagueId],
    queryFn: () => fetchLeagueById(leagueId),
  });

  if (!league) return <div>League not found</div>;

  const leagueTitle = league.name;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{leagueTitle}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        This section will show the matches of the player in the selected season and league. Player ID: {playerId}, Season ID: {seasonId}, League ID: {leagueId}
      </CardContent>
    </Card>
  );
}
