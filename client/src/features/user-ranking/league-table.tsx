import type { Ranking } from '@/api/api';
import { DataTable } from '@/components/data-table';
import {
  type ColumnDef
} from '@tanstack/react-table';

const columns: ColumnDef<Ranking>[] = [
  {
    accessorKey: 'position',
    header: 'Position',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'user.username',
    header: 'Username',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'elo',
    header: 'Rating',
    cell: (info) => info.getValue(),
  },
];

export function LeagueTable(props: { ranking: Ranking }) {
  const { ranking } = props;
  return <DataTable columns={columns} data={ranking.leagueRankings} />;
}
