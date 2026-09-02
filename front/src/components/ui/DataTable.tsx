import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { SkeletonRows } from './Skeleton';
import { EmptyState, ErrorState } from './States';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  loading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  caption?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyAction,
  caption
}: DataTableProps<T>) {
  if (loading) return <SkeletonRows rows={5} columns={Math.min(columns.length, 6)} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (rows.length === 0)
  return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;

  const mobileColumns = columns.filter(
    (column) => !column.className?.split(/\s+/).includes('hidden')
  );

  return (
    <div className="w-full">
      <div className="hidden overflow-hidden lg:block">
        <table className="w-full border-collapse text-left text-sm">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr className="border-b border-line bg-surface-subtle">
              {columns.map((column) =>
              <th
                key={column.key}
                scope="col"
                className={twMerge(
                  'px-4 py-3.5 text-xs font-bold uppercase tracking-[0.06em] text-content-muted first:pl-6 last:pr-6',
                  column.headerClassName
                )}>
                {column.header}
              </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((row) =>
            <tr key={rowKey(row)} className="transition-colors duration-fast hover:bg-brand-subtle/60">
                {columns.map((column) =>
              <td
                key={column.key}
                className={twMerge(
                  'break-words px-4 py-4 align-middle text-content first:pl-6 last:pr-6',
                  column.className
                )}>
                    {column.render(row)}
                  </td>
              )}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="divide-y divide-line lg:hidden"
        role={caption ? 'region' : undefined}
        aria-label={caption}>
        {caption && <h2 className="sr-only">{caption}</h2>}
        {rows.map((row) =>
        <dl key={rowKey(row)} className="grid gap-3 px-4 py-5 sm:px-6">
            {mobileColumns.map((column) =>
          <div key={column.key} className="grid min-w-0 grid-cols-[minmax(6.5rem,0.42fr)_minmax(0,1fr)] items-start gap-3">
                <dt className="pt-0.5 text-xs font-bold uppercase tracking-[0.05em] text-content-muted">
                  {column.header}
                </dt>
                <dd className="min-w-0 break-words text-sm text-content">
                  {column.render(row)}
                </dd>
              </div>
          )}
          </dl>
        )}
      </div>
    </div>);

}
