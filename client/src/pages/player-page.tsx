import { fetchRankingsByUserId, getUserById, getUserGames } from '@/api/api';
import { LeagueSelect } from '@/components/league-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EloChart } from '@/features/user/elo-chart/elo-chart';
import { PlayerGamesTable } from '@/features/user/player-games-table/player-games-table';
import { PlayerHeader } from '@/features/user/player-header/player-header';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';

export function PlayerPage() {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedLeagueId = searchParams.get('leagueId') || undefined;
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [showAll, setShowAll] = useState(false);

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
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Get games based on showAll setting
    const startIndex = showAll ? 0 : pageIndex * pageSize;
    const endIndex = showAll ? sortedGames.length : startIndex + pageSize;
    const displayGames = sortedGames.slice(startIndex, endIndex);

    return displayGames.map((game, index) => {
      const player = game.players.find(p => p.user.id === userId);
      const homePlayers = game.players.filter(p => p.team === 'home');
      const awayPlayers = game.players.filter(p => p.team === 'away');
      const homeNames = homePlayers.map(p => p.user.username).join(', ');
      const awayNames = awayPlayers.map(p => p.user.username).join(', ');
      const eloChange = player ? player.eloAfter - player.eloBefore : 0;

      return {
        gameNumber: startIndex + index + 1,
        elo: player?.eloAfter ?? 0,
        date: new Date(game.createdAt).toLocaleDateString(),
        score: game.score,
        homeTeam: homeNames,
        awayTeam: awayNames,
        eloChange,
        league: game.league?.name,
      };
    }).filter(data => data.elo > 0);
  }, [games, userId, pageIndex, pageSize, showAll]);

  const userLeagues = rankings
    ?.map(r => r.league)
    ?.filter(Boolean)
    || [];

  const selectedLeague = userLeagues.find(league => league.id === selectedLeagueId);
  const leagueTitle = selectedLeagueId && selectedLeagueId !== 'all'
    ? selectedLeague?.name || 'Recent Games'
    : 'All Leagues';

  const handleLeagueChange = (leagueId: string) => {
    if (leagueId === 'all') {
      searchParams.delete('leagueId');
    } else {
      searchParams.set('leagueId', leagueId);
    }
    setSearchParams(searchParams);
    setPageIndex(0); // Reset to first page when changing league
  };

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  if (!userId) return <div>Invalid player</div>;
  if (userLoading || gamesLoading || rankingsLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className='flex flex-col gap-6 grow shrink'>
      <div className='flex items-center justify-between gap-4 lg:gap-8 shrink-0'>
        <PlayerHeader user={user} />
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
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">ELO Progression</h3>
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-sm text-primary hover:underline"
                    >
                      {showAll ? 'Show Page Only' : 'Show All Games'}
                    </button>
                  </div>
                  <EloChart data={chartData} showLabels={!showAll} />
                </div>
                <PlayerGamesTable
                  games={games}
                  userId={userId}
                  selectedLeagueId={selectedLeagueId}
                  onPaginationChange={handlePaginationChange}
                />
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
