import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  pageIndex?: number;
  totalCount?: number;
  manualPagination?: boolean;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
  pageIndex,
  totalCount,
  manualPagination = false,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(!manualPagination && { getPaginationRowModel: getPaginationRowModel() }),
    manualPagination,
    pageCount: manualPagination && totalCount !== undefined ? Math.ceil(totalCount / pageSize) : undefined,
    state: pageIndex !== undefined ? {
      pagination: {
        pageIndex,
        pageSize,
      },
    } : undefined,
    onPaginationChange: pageIndex !== undefined ? (updater) => {
      const currentState = { pageIndex, pageSize };
      const newState = typeof updater === 'function'
        ? updater(currentState)
        : updater;
      onPaginationChange?.(newState.pageIndex, newState.pageSize);
    } : undefined,
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const paginationState = table.getState().pagination;

  useEffect(() => {
    // Only call onPaginationChange if we're not using controlled state (pageIndex is undefined)
    if (pageIndex === undefined) {
      onPaginationChange?.(paginationState.pageIndex, paginationState.pageSize);
    }
  }, [paginationState.pageIndex, paginationState.pageSize, pageIndex, onPaginationChange]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
