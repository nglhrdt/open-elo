import { useGetSeasonRanking } from '@/api/hooks/use-seasons';
import { AuthContext } from '@/components/AuthContext';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserAvatar from '@/components/user-avatar';
import type { Ranking } from '@open-elo/shared';
import { type ColumnDef } from '@tanstack/react-table';
import { useContext } from 'react';
import { Link } from 'react-router';

export function SeasonTable(props: { seasonId: string }) {
  const { seasonId } = props;
  const { user } = useContext(AuthContext);

  const { data: seasonRankings, isPending } = useGetSeasonRanking(seasonId);

  const columns: ColumnDef<Ranking>[] = [
    {
      accessorKey: 'position',
      header: 'Position',
      cell: (info) => info.getValue(),
    },
    {
      accessorFn: (row) => row,
      header: 'Username',
      cell: (info) => {
        const ranking = info.getValue() as Ranking;
        return (
          <Link
            to={`/leagues/${ranking.leagueId}/seasons/${seasonId}/players/${ranking.userId}`}
          >
            <UserAvatar userId={ranking.userId} showName size="size-8" />
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
        <CardTitle>Ranking</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <div>Loading...</div>
        ) : !seasonRankings || seasonRankings.length === 0 ? (
          <p className="text-muted-foreground">No rankings found</p>
        ) : (
          <DataTable columns={columns} data={seasonRankings} pageSize={10} />
        )}
      </CardContent>
    </Card>
  );
}
