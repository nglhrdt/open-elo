import { getUserById, getUserGames, fetchRankingsByUserId, type Game } from '@/api/api';
import { DataTable } from '@/components/data-table';
import { ModeToggle } from '@/components/mode-toggle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConvertGuestDialog } from '@/features/user/convert/convert-guest-dialog';
import { UserMenu } from '@/features/user/menu/user-menu';
import { LeagueSelect } from '@/components/league-select';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { Link, useParams, useSearchParams } from 'react-router';

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

  const userLeagues = rankings
    ?.map(r => r.league)
    ?.filter(Boolean)
    || [];

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
              <CardTitle>Recent Games</CardTitle>
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
          <CardContent>
            {games && games.length > 0 ? (
              <DataTable columns={gameColumns} data={games} />
            ) : (
              <p className='text-muted-foreground'>No games yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
