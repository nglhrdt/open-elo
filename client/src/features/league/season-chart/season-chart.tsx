import { useGetSeasonEloChart } from '@/api/hooks/use-seasons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis } from 'recharts';

type SeasonChartProps = {
  seasonId: string;
};

export function SeasonChart({ seasonId }: SeasonChartProps) {
  const { data: eloChart } = useGetSeasonEloChart(seasonId);
  const players = eloChart?.length
    ? Object.keys(eloChart[eloChart.length - 1]).filter((key) => key !== 'date')
    : [];

  const chartConfig = players.reduce(
    (acc, player) => {
      acc[player] = {
        label: player,
        color: `var(--chart-${players.indexOf(player) + 1})`,
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  const chartData =
    eloChart?.map((data) => {
      const month = new Date(data.date).toLocaleString('default', {
        month: 'short',
      });
      return { ...data, month };
    }) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Season Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            {/* <CartesianGrid vertical={false} /> */}
            <XAxis
              dataKey="month"
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis tickMargin={8} domain={['auto', 'auto']} />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            {players.map((player) => (
              <Line
                key={player}
                dataKey={player}
                type="monotone"
                stroke={chartConfig[player].color}
                strokeWidth={2}
                dot={true}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
