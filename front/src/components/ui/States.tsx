import type { ReactNode } from 'react';
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  InboxIcon,
  Loader2Icon,
  LockIcon,
  SearchXIcon,
  WifiOffIcon
} from 'lucide-react';
import { Button } from './Button';
import { errorMessage, statusOf } from '../../utils/errors';
import { useI18n } from '../../contexts/i18n';

export function EmptyState({
  title,
  description,
  action,
  icon





}: {title: string;description?: string;action?: ReactNode;icon?: ReactNode;}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center sm:px-8" role="status">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-subtle text-content-muted">
        {icon ?? <InboxIcon className="h-5 w-5" aria-hidden="true" />}
      </span>
      <h3 className="mt-4 font-display text-base font-bold text-content-strong">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-content-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>);

}

export function NoResultsState({ title, description }: {title: string;description?: string;}) {
  return <EmptyState title={title} description={description} icon={<SearchXIcon className="h-5 w-5" aria-hidden="true" />} />;
}

export function LoadingState({ label }: {label?: string;}) {
  const { t } = useI18n();
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-6 py-10 text-content-muted" role="status" aria-live="polite">
      <Loader2Icon className="h-6 w-6 animate-spin text-accent motion-reduce:animate-none" aria-hidden="true" />
      <span className="text-sm font-medium">{label ?? t('state.loading')}</span>
    </div>
  );
}

export function SuccessState({ title, description, action }: {title: string;description?: string;action?: ReactNode;}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center sm:px-8" role="status" aria-live="polite">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-positive/10 text-positive">
        <CheckCircle2Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-base font-bold text-content-strong">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-content-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/** Maps 401/403/404/409 and network failures to a friendly state. */
export function ErrorState({ error, onRetry }: {error: unknown;onRetry?: () => void;}) {
  const { t } = useI18n();
  const status = statusOf(error);
  const forbidden = status === 403;
  const notFound = status === 404;
  const networkFailure = status === 0;

  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center sm:px-8" role="alert" aria-live="assertive">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full ${
        forbidden ? 'bg-warning/10 text-warning' : networkFailure ? 'bg-info/10 text-info' : 'bg-danger/10 text-danger'}`
        }>
        
        {forbidden ? (
          <LockIcon className="h-5 w-5" aria-hidden="true" />
        ) : networkFailure ? (
          <WifiOffIcon className="h-5 w-5" aria-hidden="true" />
        ) : (
          <AlertTriangleIcon className="h-5 w-5" aria-hidden="true" />
        )}
      </span>
      <h3 className="mt-4 font-display text-base font-bold text-content-strong">
        {forbidden
          ? t('state.forbidden')
          : notFound
            ? t('state.notFoundTitle')
            : networkFailure
              ? t('state.networkError', "Tarmoq bilan aloqa yo'q")
              : t('state.errorTitle')}
      </h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-content-muted">{errorMessage(error)}</p>
      {onRetry && !forbidden &&
      <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          {t('action.retry')}
        </Button>
      }
    </div>);

}
