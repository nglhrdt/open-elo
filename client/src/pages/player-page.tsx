import { fetchRankingsByUserId, getUserById, getUserGames } from '@/api/api';
import { LeagueSelect } from '@/components/league-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [selectedSeason, setSelectedSeason] = useState<number | 'all' | 'current'>('current');

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

  // Fetch all games to determine available seasons (lightweight query)
  const { data: allGamesResponse } = useQuery({
    queryKey: ['userGamesMetadata', userId, selectedLeagueId],
    queryFn: () => getUserGames(userId!, { count: 10000, leagueId: selectedLeagueId }),
    enabled: !!userId,
  });

  const allGames = allGamesResponse?.data || [];

  const userLeagues = rankings
    ?.map(r => r.league)
    ?.filter(Boolean)
    || [];

  // Determine available seasons from all games
  const availableSeasons = useMemo(() => {
    if (!allGames || allGames.length === 0) return [];
    const seasons = [...new Set(allGames.map(g => g.seasonNumber))].sort((a, b) => b - a);
    return seasons;
  }, [allGames]);

  // Get current season from selected league or from games
  const currentSeasonNumber = useMemo(() => {
    if (selectedLeagueId && selectedLeagueId !== 'all') {
      const league = userLeagues.find(l => l.id === selectedLeagueId);
      if (league?.currentSeasonNumber) {
        return league.currentSeasonNumber;
      }
    }
    // If no league selected or 'all', use the highest season number from games
    return availableSeasons[0] || 1;
  }, [selectedLeagueId, userLeagues, availableSeasons]);

  const { isPending: gamesLoading, data: gamesResponse } = useQuery({
    queryKey: ['userGames', userId, selectedLeagueId, selectedSeason, pageIndex, pageSize, currentSeasonNumber],
    queryFn: () => {
      const params: { leagueId?: string; seasonNumber?: number; skip: number; take: number } = {
        skip: pageIndex * pageSize,
        take: pageSize,
        leagueId: selectedLeagueId,
      };
      // Set seasonNumber based on selection
      if (selectedSeason === 'current') {
        params.seasonNumber = currentSeasonNumber;
      } else if (selectedSeason !== 'all') {
        params.seasonNumber = selectedSeason;
      }
      // Don't set seasonNumber if 'all' is selected
      return getUserGames(userId!, params);
    },
    enabled: !!userId && availableSeasons.length > 0,
  });

  const games = gamesResponse?.data || [];
  const totalGames = gamesResponse?.total || 0;

  const chartData = useMemo(() => {
    if (!games || games.length === 0) return [];

    return games.map((game, index) => {
      const player = game.players.find(p => p.user.id === userId);
      const homePlayers = game.players.filter(p => p.team === 'home');
      const awayPlayers = game.players.filter(p => p.team === 'away');
      const homeNames = homePlayers.map(p => p.user.username).join(', ');
      const awayNames = awayPlayers.map(p => p.user.username).join(', ');
      const eloChange = player ? player.eloAfter - player.eloBefore : 0;

      return {
        gameNumber: pageIndex * pageSize + index + 1,
        elo: player?.eloAfter ?? 0,
        date: new Date(game.createdAt).toLocaleDateString(),
        score: game.score,
        homeTeam: homeNames,
        awayTeam: awayNames,
        eloChange,
        league: game.league?.name,
      };
    }).filter(data => data.elo > 0);
  }, [games, userId, pageIndex, pageSize]);

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
    setSelectedSeason('current'); // Reset to current season when changing league
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
              <div className='flex items-center gap-2'>
                {userLeagues.length > 0 && (
                  <div className='w-48'>
                    <LeagueSelect
                      leagues={[{ id: 'all', name: 'All Leagues', type: 'TABLE_SOCCER' }, ...userLeagues]}
                      value={selectedLeagueId || 'all'}
                      onChange={handleLeagueChange}
                      placeholder="Filter by league"
                    />
                  </div>
                )}
                {availableSeasons.length > 0 && (
                  <Select
                    value={selectedSeason === 'current' ? currentSeasonNumber.toString() : selectedSeason.toString()}
                    onValueChange={(value) => {
                      if (value === 'all') {
                        setSelectedSeason('all');
                      } else {
                        setSelectedSeason(parseInt(value));
                      }
                      setPageIndex(0);
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={currentSeasonNumber.toString()}>
                        Season {currentSeasonNumber} (Current)
                      </SelectItem>
                      {availableSeasons
                        .filter(s => s !== currentSeasonNumber)
                        .map(season => (
                          <SelectItem key={season} value={season.toString()}>
                            Season {season}
                          </SelectItem>
                        ))}
                      <SelectItem value="all">All Seasons</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {games && games.length > 0 ? (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">ELO Progression</h3>
                  <EloChart data={chartData} showLabels={true} />
                </div>
                <PlayerGamesTable
                  games={games}
                  userId={userId}
                  selectedLeagueId={selectedLeagueId}
                  pageIndex={pageIndex}
                  totalCount={totalGames}
                  onPaginationChange={handlePaginationChange}
                />
              </>
            ) : (
              <p className='text-muted-foreground'>No games played yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
