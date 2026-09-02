import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export function Panel({ className, children }: {className?: string;children: ReactNode;}) {
  return (
    <section className={twMerge('rounded-surface border border-line bg-surface-raised shadow-surface', className)}>
      {children}
    </section>);

}

interface PanelHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PanelHeader({ title, description, actions, className }: PanelHeaderProps) {
  return (
    <header
      className={twMerge(
        'flex flex-col gap-3 border-b border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5',
        className
      )}>
      
      <div className="min-w-0">
        <h2 className="font-display text-base font-bold tracking-tight text-content-strong">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-content-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>);

}

export function PanelBody({ className, children }: {className?: string;children: ReactNode;}) {
  return <div className={twMerge('px-4 py-5 sm:px-6 sm:py-6', className)}>{children}</div>;
}
