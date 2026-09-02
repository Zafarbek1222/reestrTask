import { LayersIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../contexts/i18n';

export function Logo({ to = '/', tone = 'dark' }: { to?: string; tone?: 'dark' | 'light' }) {
  const { t } = useI18n();
  const isLight = tone === 'light';

  return (
    <Link to={to} className="group flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg">
      <span
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
          isLight
            ? 'border-white/15 bg-white/10 text-white group-hover:bg-white/15'
            : 'border-navy-800 bg-navy-900 text-white group-hover:bg-navy-800'
        }`}
      >
        <LayersIcon className="h-[18px] w-[18px]" aria-hidden="true" />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-current bg-teal-400" aria-hidden="true" />
      </span>
      <span className="min-w-0 leading-tight">
        <span
          className={`block truncate font-display text-[17px] font-extrabold tracking-tight ${
            isLight ? 'text-white' : 'text-navy-950'
          }`}
        >
          {t('app.name')}
        </span>
        <span
          className={`hidden max-w-[13rem] truncate text-[11px] sm:block ${
            isLight ? 'text-navy-300' : 'text-navy-400'
          }`}
        >
          {t('app.tagline')}
        </span>
      </span>
    </Link>
  );
}
