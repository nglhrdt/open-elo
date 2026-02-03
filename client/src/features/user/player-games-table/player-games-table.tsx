import { type Game } from '@/api/api';
import { DataTable } from '@/components/data-table';
import { type ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';

interface PlayerGamesTableProps {
  games: Game[];
  userId: string;
  selectedLeagueId?: string;
  pageIndex?: number;
  totalCount?: number;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function PlayerGamesTable({ games, userId, selectedLeagueId, pageIndex, totalCount, onPaginationChange }: PlayerGamesTableProps) {
  const gameColumns: ColumnDef<Game>[] = [
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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Recent Games</h3>
      <DataTable
        columns={gameColumns}
        data={games}
        pageIndex={pageIndex}
        manualPagination={totalCount !== undefined}
        totalCount={totalCount}
        onPaginationChange={onPaginationChange}
      />
    </div>
  );
}
