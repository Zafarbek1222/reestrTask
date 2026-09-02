import { twMerge } from 'tailwind-merge';
import { useI18n } from '../../contexts/i18n';

export function Skeleton({ className }: {className?: string;}) {
  return <div aria-hidden="true" className={twMerge('animate-pulse rounded-md bg-navy-100 motion-reduce:animate-none', className)} />;
}

export function SkeletonText({ lines = 3, className }: {lines?: number;className?: string;}) {
  const { t } = useI18n();
  return (
    <div className={twMerge('space-y-2.5', className)} role="status" aria-live="polite">
      <span className="sr-only">{t('state.loading')}</span>
      {Array.from({ length: lines }).map((_, index) =>
      <Skeleton key={index} className={index === lines - 1 ? 'h-3.5 w-2/3' : 'h-3.5 w-full'} />
      )}
    </div>);

}

export function SkeletonCards({ count = 6 }: {count?: number;}) {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-live="polite">
      <span className="sr-only">{t('state.loading')}</span>
      {Array.from({ length: count }).map((_, index) =>
      <div key={index} className="rounded-surface border border-line bg-surface p-5 shadow-surface">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-5 h-3 w-1/3" />
        </div>
      )}
    </div>);

}

export function SkeletonRows({ rows = 5, columns = 5 }: {rows?: number;columns?: number;}) {
  const { t } = useI18n();
  return (
    <div className="divide-y divide-line" role="status" aria-live="polite">
      <span className="sr-only">{t('state.loading')}</span>
      {Array.from({ length: rows }).map((_, rowIndex) =>
      <div key={rowIndex} className="px-4 py-5 sm:px-6">
          <div className="grid gap-3 lg:hidden">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="hidden items-center gap-4 lg:flex">
            {Array.from({ length: columns }).map((__, colIndex) =>
          <Skeleton key={colIndex} className={colIndex === 0 ? 'h-3.5 w-10' : 'h-3.5 flex-1'} />
          )}
          </div>
        </div>
      )}
    </div>);

}
