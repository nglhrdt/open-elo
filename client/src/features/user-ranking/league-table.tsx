import type { Ranking } from '@/api/api';
import { fetchLeagueRankings } from '@/api/api';
import { AuthContext } from '@/components/AuthContext';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import {
  type ColumnDef
} from '@tanstack/react-table';
import { useContext } from 'react';
import { Link } from 'react-router';

export function LeagueTable(props: { leagueId: string; seasonNumber?: number }) {
  const { leagueId, seasonNumber } = props;
  const { user } = useContext(AuthContext);

  const { isPending, data: rankings } = useQuery({
    queryKey: ['leagueRankings', leagueId, seasonNumber],
    queryFn: () => fetchLeagueRankings(leagueId, seasonNumber),
    enabled: !!leagueId,
  });

  const columns: ColumnDef<Ranking>[] = [
    {
      accessorKey: 'position',
      header: 'Position',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'user',
      header: 'Username',
      cell: (info) => {
        const user = info.row.original.user;
        return (
          <Link
            to={`/players/${user.id}?leagueId=${leagueId}`}
            className="text-primary hover:underline"
          >
            {user.username}
          </Link>
        );
      },
    },
    {
      accessorKey: 'elo',
      header: 'Rating',
      cell: (info) => info.getValue(),
    },
  ];

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Ranking
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div>Loading...</div>
        ) : !rankings || rankings.length === 0 ? (
          <p className='text-muted-foreground'>No rankings found</p>
        ) : (
          <DataTable columns={columns} data={rankings} pageSize={10} />
        )}
      </CardContent>
    </Card>
  )
}
