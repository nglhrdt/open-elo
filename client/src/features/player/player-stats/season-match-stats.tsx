import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { Pie, PieChart } from 'recharts';

type SeasonMatchStatsProps = {
  playerId: string;
  seasonId: string;
};

function SeasonMatchStats({ playerId, seasonId }: SeasonMatchStatsProps) {
  const { data: stats } = useGetUserSeasonStats(playerId, seasonId);

  const winningRate = stats
    ? stats.total.won / (stats.total.won + stats.total.lost + stats.total.draw)
    : 0;

  const chartData = [
    { result: 'won', percent: winningRate * 100, fill: 'green' },
    { result: 'lost', percent: (1 - winningRate) * 100, fill: 'red' },
    { result: 'draw', percent: 0, fill: 'yellow' },
  ];
  const chartConfig = {
    won: {
      label: 'Won',
    },
    lost: {
      label: 'Lost',
    },
    draw: {
      label: 'Draw',
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="percent"
              nameKey="result"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}

export default SeasonMatchStats;
