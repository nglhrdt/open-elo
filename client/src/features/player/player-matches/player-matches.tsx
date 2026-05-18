import { useGetMatches } from '@/api/hooks/use-matches';
import { DataTable } from '@/components/data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Match } from '@open-elo/shared';
import { type ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { PlayersByTeam } from './players-by-team';

interface PlayerMatchesProps {
  playerId: string;
  seasonId: string;
}

export function PlayerMatches({ playerId, seasonId }: PlayerMatchesProps) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { data } = useGetMatches({
    playerId,
    seasonId,
    take: pagination.pageSize,
    skip: pagination.pageIndex * pagination.pageSize,
  });

  const columns: ColumnDef<Match>[] = [
    {
      accessorFn: (row) => row,
      header: 'Home',
      cell: ({ getValue }) => (
        <PlayersByTeam match={getValue() as Match} team="HOME" />
      ),
    },
    {
      accessorKey: 'score',
      header: 'Score',
    },
    {
      accessorFn: (row) => row,
      header: 'Away',
      cell: ({ getValue }) => (
        <PlayersByTeam match={getValue() as Match} team="AWAY" />
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matches</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DataTable
          columns={columns}
          data={data?.matches || []}
          totalCount={data?.totalCount || 0}
          onPaginationChange={(pageIndex, pageSize) =>
            setPagination({ pageIndex, pageSize })
          }
        />
      </CardContent>
    </Card>
  );
}
