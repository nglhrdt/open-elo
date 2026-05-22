import { useGetUserSeasonStats } from '@/api/hooks/use-users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Label, Pie, PieChart } from 'recharts';

type SeasonMatchStatsProps = {
  playerId: string;
  seasonId: string;
};

function SeasonMatchStats({ playerId, seasonId }: SeasonMatchStatsProps) {
  const { data: stats } = useGetUserSeasonStats(playerId, seasonId);

  const winningRate = stats
    ? Math.floor(
        (stats.total.won /
          (stats.total.won + stats.total.lost + stats.total.draw)) *
          100,
      )
    : 0;

  const chartData = [
    { result: 'won', matches: stats?.total.won ?? 0, fill: 'var(--chart-2)' },
    { result: 'lost', matches: stats?.total.lost ?? 0, fill: 'var(--chart-5)' },
    { result: 'draw', matches: stats?.total.draw ?? 0, fill: 'var(--chart-3)' },
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
    <Card>
      <CardHeader>
        <CardTitle>Season Match Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-52 "
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="matches"
              nameKey="result"
              innerRadius={60}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {winningRate}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Winning Rate
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default SeasonMatchStats;
