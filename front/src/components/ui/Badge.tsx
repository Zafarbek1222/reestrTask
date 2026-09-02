import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { useI18n } from '../../contexts/i18n';

type Tone = 'navy' | 'teal' | 'green' | 'red' | 'gray' | 'amber';

const tones: Record<Tone, string> = {
  navy: 'bg-brand-subtle text-brand ring-brand/15',
  teal: 'bg-accent-subtle text-accent-pressed ring-accent/20',
  green: 'bg-positive/10 text-positive ring-positive/20',
  red: 'bg-danger/10 text-danger ring-danger/20',
  gray: 'bg-surface-subtle text-content-muted ring-line',
  amber: 'bg-warning/10 text-warning ring-warning/20'
};

export function Badge({
  tone = 'navy',
  className,
  children




}: {tone?: Tone;className?: string;children: ReactNode;}) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold leading-none ring-1 ring-inset',
        tones[tone],
        className
      )}>
      
      {children}
    </span>);

}

export function StatusBadge({ enabled }: {enabled: boolean;}) {
  const { t } = useI18n();
  return (
    <Badge tone={enabled ? 'green' : 'gray'}>
      <span
        aria-hidden="true"
        className={enabled ? 'h-1.5 w-1.5 rounded-full bg-positive' : 'h-1.5 w-1.5 rounded-full bg-content-subtle'}
      />
      {enabled ? t('status.active') : t('status.inactive')}
    </Badge>);

}
