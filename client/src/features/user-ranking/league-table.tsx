import type { Ranking } from '@/api/api';
import { AuthContext } from '@/components/AuthContext';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ColumnDef
} from '@tanstack/react-table';
import { useContext } from 'react';

const columns: ColumnDef<Ranking>[] = [
  {
    accessorKey: 'position',
    header: 'Position',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'user',
    header: 'Username',
    cell: (info) => info.row.original.user.username,
  },
  {
    accessorKey: 'elo',
    header: 'Rating',
    cell: (info) => info.getValue(),
  },
];

export function LeagueTable(props: { ranking: Ranking }) {
  const { ranking } = props;
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Ranking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={ranking.leagueRankings} />
      </CardContent>
    </Card>
  )
}
