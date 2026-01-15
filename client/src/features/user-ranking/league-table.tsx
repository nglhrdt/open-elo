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

export function LeagueTable(props: { leagueId: string }) {
  const { leagueId } = props;
  const { user } = useContext(AuthContext);

  const { isPending, data: rankings } = useQuery({
    queryKey: ['leagueRankings', leagueId],
    queryFn: () => fetchLeagueRankings(leagueId),
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
  if (isPending) return <div>Loading...</div>;
  if (!rankings || rankings.length === 0) return <div>No rankings found</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Ranking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={rankings} />
      </CardContent>
    </Card>
  )
}
