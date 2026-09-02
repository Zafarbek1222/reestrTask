import { Component, type ReactNode } from 'react';
import { AlertTriangleIcon, RotateCcwIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../../contexts/i18n';
import { Button } from './Button';

interface BoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  resetKey: string;
}

interface BoundaryState {
  failed: boolean;
}

class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError(): BoundaryState {
    return { failed: true };
  }

  componentDidCatch(): void {
    // React reports the original exception in development; production can attach monitoring here.
  }

  componentDidUpdate(previous: BoundaryProps): void {
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.setState({ failed: false });
    }
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const location = useLocation();

  const fallback = (
    <main className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-12">
      <section role="alert" className="w-full max-w-lg rounded-overlay border border-line bg-surface p-6 text-center shadow-elevated sm:p-8">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
          <AlertTriangleIcon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-xl font-bold text-content-strong">{t('state.errorTitle')}</h1>
        <p className="mt-2 text-sm leading-6 text-content-muted">
          {t('state.errorText', "Sahifani yuklashda xatolik yuz berdi. Qayta urinib ko'ring.")}
        </p>
        <Button
          className="mt-6"
          variant="outline"
          icon={<RotateCcwIcon className="h-4 w-4" />}
          onClick={() => window.location.reload()}
        >
          {t('action.retry')}
        </Button>
      </section>
    </main>
  );

  return (
    <ErrorBoundary resetKey={`${location.pathname}${location.search}${location.hash}`} fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}
