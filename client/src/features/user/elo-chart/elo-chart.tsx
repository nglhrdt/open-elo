import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface ChartDataPoint {
  gameNumber: number;
  elo: number;
  date: string;
  score: string;
  homeTeam: string;
  awayTeam: string;
  eloChange: number;
  league?: string;
}

interface EloChartProps {
  data: ChartDataPoint[];
  showLabels?: boolean;
}

export function EloChart({ data, showLabels = true }: EloChartProps) {
  // Calculate Y-axis domain for better visualization
  const minElo = data.length > 0 ? Math.min(...data.map(d => d.elo)) : 0;
  const maxElo = data.length > 0 ? Math.max(...data.map(d => d.elo)) : 0;
  const padding = Math.max(20, (maxElo - minElo) * 0.1);
  const yDomain = [Math.floor(minElo - padding), Math.ceil(maxElo + padding)];

  return (
    <div>
      <div className="h-[300px] w-full">
        <ChartContainer
          config={{
            elo: {
              label: "ELO Rating",
              color: "hsl(142 76% 36%)",
            },
          }}
          className="h-full w-full aspect-auto"
        >
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="gameNumber"
              label={{ value: 'Game Number', position: 'insideBottom', offset: -5 }}
              className="text-xs"
            />
            <YAxis
              domain={yDomain}
              label={{ value: 'ELO Rating', angle: -90, position: 'insideLeft' }}
              className="text-xs"
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-sm">
                    <div className="grid gap-2">
                      <div className="font-semibold">Game {data.gameNumber}</div>
                      <div className="text-sm text-muted-foreground">{data.date}</div>
                      {data.league && <div className="text-sm">{data.league}</div>}
                      <div className="text-sm">{data.homeTeam} vs {data.awayTeam}</div>
                      <div className="text-sm font-medium">Score: {data.score}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">ELO: {data.elo}</span>
                        <span className={`text-sm font-medium ${
                          data.eloChange > 0 ? 'text-green-600' : data.eloChange < 0 ? 'text-red-600' : ''
                        }`}>
                          ({data.eloChange > 0 ? '+' : ''}{data.eloChange})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="elo"
              stroke="var(--color-elo)"
              strokeWidth={2}
              dot={{ fill: "var(--color-elo)" }}
              activeDot={{ r: 6 }}
              label={showLabels ? { position: 'top', fontSize: 12 } : false}
            />
          </LineChart>
        </ChartContainer>
      </div>
    </div>
  );
}
