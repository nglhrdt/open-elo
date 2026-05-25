import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

type PlayerWinLooseProps = {
  playerId: string;
  seasonId: string;
};

function PlayerWinLoose({ playerId, seasonId }: PlayerWinLooseProps) {
  const { data: stats } = useGetUserSeasonStats(playerId, seasonId);

  if (!stats) return null;

  const chartData = Object.values(stats.byPlayer)
    .sort(
      (p1, p2) =>
        p2.against.won +
        p2.against.lost +
        p2.against.draw -
        (p1.against.won + p1.against.lost + p1.against.draw),
    )
    .slice(0, 6)
    .map((player) => {
      return {
        username: player.username,
        wins: player.against.won,
        losses: player.against.lost,
      };
    });

  const chartConfig = {
    wins: {
      label: 'Wins',
      color: 'var(--chart-2)',
    },
    losses: {
      label: 'Losses',
      color: 'var(--chart-5)',
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Player Wins / Losses</CardTitle>
        <CardDescription>
          Showing the top 6 players with the most matches played against.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-video">
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="username" />
            <PolarGrid />
            <Radar
              dataKey="losses"
              fill="var(--chart-5)"
              fillOpacity={0.4}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
            <Radar
              dataKey="wins"
              fill="var(--chart-2)"
              fillOpacity={0.4}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default PlayerWinLoose;
