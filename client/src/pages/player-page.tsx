import { fetchUserRankings, getUserGames, type Game, type Ranking } from '@/api/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/data-table';
import { ModeToggle } from '@/components/mode-toggle';
import { UserMenu } from '@/features/user/menu/user-menu';
import { useQuery } from '@tanstack/react-query';
import { type ColumnDef } from '@tanstack/react-table';
import { useParams, Link } from 'react-router';

const gameColumns: ColumnDef<Game>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: (info) => new Date(info.getValue() as Date).toLocaleDateString(),
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: (info) => info.getValue(),
  },
  {
    id: 'players',
    header: 'Players',
    cell: (info) => {
      const game = info.row.original;
      return game.players.map(p => p.user.username).join(', ');
    },
  },
  {
    id: 'eloChange',
    header: 'ELO Change',
    cell: (info) => {
      const game = info.row.original;
      const player = game.players.find(p => p.user.id === info.row.original.players[0].user.id);
      if (!player) return 'N/A';
      const change = player.eloAfter - player.eloBefore;
      return change > 0 ? `+${change}` : change.toString();
    },
  },
];

const rankingColumns: ColumnDef<Ranking>[] = [
  {
    accessorKey: 'league.name',
    header: 'League',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'position',
    header: 'Position',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'elo',
    header: 'Rating',
    cell: (info) => info.getValue(),
  },
];

export function PlayerPage() {
  const { userId } = useParams<{ userId: string }>();

  const { isPending: gamesLoading, data: games } = useQuery({
    queryKey: ['userGames', userId],
    queryFn: () => getUserGames(userId!, { count: 20 }),
    enabled: !!userId,
  });

  const { isPending: rankingsLoading, data: allRankings } = useQuery({
    queryKey: ['rankings'],
    queryFn: fetchUserRankings,
  });

  if (!userId) return <div>Invalid player</div>;
  if (gamesLoading || rankingsLoading) return <div>Loading...</div>;

  // Filter rankings to show only this user's rankings
  const userRankings = allRankings?.filter(r => r.user && r.user.id === userId) || [];
  const username = userRankings[0]?.user.username || 'Player';

  return (
    <div className='flex flex-col gap-4 grow shrink'>
      <div className='flex items-center justify-between gap-4 lg:gap-8 shrink-0'>
        <div className='flex flex-col gap-2'>
          <Link to="/" className='text-sm text-muted-foreground hover:underline'>
            ← Back to Home
          </Link>
          <h1 className='text-2xl font-bold'>{username}</h1>
        </div>
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <UserMenu />
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8'>
        <Card>
          <CardHeader>
            <CardTitle>Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            {userRankings.length > 0 ? (
              <DataTable columns={rankingColumns} data={userRankings} />
            ) : (
              <p className='text-muted-foreground'>No rankings yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Games</CardTitle>
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
