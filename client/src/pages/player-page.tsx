import { fetchRankingsByUserId, getUserById, getUserGames, type Game } from '@/api/api';
import { DataTable } from '@/components/data-table';
import { LeagueSelect } from '@/components/league-select';
import { ModeToggle } from '@/components/mode-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { ConvertGuestDialog } from '@/features/user/convert/convert-guest-dialog';
import { UserMenu } from '@/features/user/menu/user-menu';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

export function PlayerPage() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLeagueId = searchParams.get('leagueId') || undefined;

  const { isPending: userLoading, data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId,
  });

  const { isPending: rankingsLoading, data: rankings } = useQuery({
    queryKey: ['userRankings', userId],
    queryFn: () => fetchRankingsByUserId(userId!),
    enabled: !!userId,
  });

  const { isPending: gamesLoading, data: games } = useQuery({
    queryKey: ['userGames', userId, selectedLeagueId],
    queryFn: () => getUserGames(userId!, { count: 100, leagueId: selectedLeagueId }),
    enabled: !!userId,
  });

  const chartData = useMemo(() => {
    if (!games || games.length === 0) return [];

    // Sort games by date to ensure chronological order
    const sortedGames = [...games].sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedGames.map((game, index) => {
      const player = game.players.find(p => p.user.id === userId);
      const homePlayers = game.players.filter(p => p.team === 'home');
      const awayPlayers = game.players.filter(p => p.team === 'away');
      const homeNames = homePlayers.map(p => p.user.username).join(', ');
      const awayNames = awayPlayers.map(p => p.user.username).join(', ');
      const eloChange = player ? player.eloAfter - player.eloBefore : 0;

      return {
        gameNumber: index + 1,
        elo: player?.eloAfter ?? 0,
        date: new Date(game.createdAt).toLocaleDateString(),
        score: game.score,
        homeTeam: homeNames,
        awayTeam: awayNames,
        eloChange,
        league: game.league?.name,
      };
    }).filter(data => data.elo > 0);
  }, [games, userId]);

  const userLeagues = rankings
    ?.map(r => r.league)
    ?.filter(Boolean)
    || [];

  const selectedLeague = userLeagues.find(league => league.id === selectedLeagueId);
  const leagueTitle = selectedLeagueId && selectedLeagueId !== 'all'
    ? selectedLeague?.name || 'Recent Games'
    : 'All Leagues';

  const gameColumns: ColumnDef<Game>[] = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: (info) => new Date(info.getValue() as Date).toLocaleDateString(),
    },
    {
      id: 'homePlayers',
      header: 'Home',
      cell: (info) => {
        const game = info.row.original;
        const homePlayers = game.players.filter(p => p.team === 'home');
        return (
          <div className="flex gap-2 flex-wrap">
            {homePlayers.map((p, index) => (
              <span key={p.user.id}>
                <Link to={`/players/${p.user.id}${selectedLeagueId ? `?leagueId=${selectedLeagueId}` : ''}`} className="text-primary hover:underline">
                  {p.user.username}
                </Link>
                {' '}({p.eloAfter})
                {index < homePlayers.length - 1 && ','}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: (info) => info.getValue(),
    },
    {
      id: 'awayPlayers',
      header: 'Away',
      cell: (info) => {
        const game = info.row.original;
        const awayPlayers = game.players.filter(p => p.team === 'away');
        return (
          <div className="flex gap-2 flex-wrap">
            {awayPlayers.map((p, index) => (
              <span key={p.user.id}>
                <Link to={`/players/${p.user.id}${selectedLeagueId ? `?leagueId=${selectedLeagueId}` : ''}`} className="text-primary hover:underline">
                  {p.user.username}
                </Link>
                {' '}({p.eloAfter})
                {index < awayPlayers.length - 1 && ','}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      id: 'eloChange',
      header: 'ELO Change',
      cell: (info) => {
        const game = info.row.original;
        const player = game.players.find(p => p.user.id === userId);
        if (!player) return 'N/A';
        const change = player.eloAfter - player.eloBefore;
        const colorClass = change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : '';
        return <span className={colorClass}>{change > 0 ? `+${change}` : change.toString()}</span>;
      },
    },
  ];

  const handleLeagueChange = (leagueId: string) => {
    if (leagueId === 'all') {
      searchParams.delete('leagueId');
    } else {
      searchParams.set('leagueId', leagueId);
    }
    setSearchParams(searchParams);
  };

  if (!userId) return <div>Invalid player</div>;
  if (userLoading || gamesLoading || rankingsLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const isGuest = user.role === 'guest';

  return (
    <div className='flex flex-col gap-4 grow shrink'>
      <div className='flex items-center justify-between gap-4 lg:gap-8 shrink-0'>
        <div className='flex flex-col gap-2'>
          <Link to="/" className='text-sm text-muted-foreground hover:underline'>
            ← Back to Home
          </Link>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'>{user.username}</h1>
            {isGuest && (
              <ConvertGuestDialog user={user} />
            )}
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <UserMenu />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:gap-8'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>{leagueTitle}</CardTitle>
              {userLeagues.length > 0 && (
                <div className='w-64'>
                  <LeagueSelect
                    leagues={[{ id: 'all', name: 'All Leagues', type: 'TABLE_SOCCER' }, ...userLeagues]}
                    value={selectedLeagueId || 'all'}
                    onChange={handleLeagueChange}
                    placeholder="Filter by league"
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {games && games.length > 0 ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4">ELO Progression</h3>
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
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                          dataKey="gameNumber"
                          label={{ value: 'Game Number', position: 'insideBottom', offset: -5 }}
                          className="text-xs"
                        />
                        <YAxis
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
                          label={{ position: 'top', fontSize: 12 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Games</h3>
                  <DataTable columns={gameColumns} data={games} />
                </div>
              </>
            ) : (
              <p className='text-muted-foreground'>No games yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
