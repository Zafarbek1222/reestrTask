import { ArrowLeftIcon, SearchXIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../contexts/i18n';

export function NotFound() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-[65vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-navy-100 bg-white shadow-card">
        <SearchXIcon className="h-9 w-9 text-navy-400" aria-hidden="true" />
        <span className="absolute -right-2 -top-2 rounded-full bg-navy-900 px-2.5 py-1 font-display text-xs font-bold text-white">404</span>
      </div>
      <h1 className="mt-7 font-display text-2xl font-extrabold tracking-tight text-navy-950 sm:text-3xl">
        {t('state.notFoundTitle')}
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-6 text-navy-500">{t('state.notFoundText')}</p>
      <Link
        to="/"
        className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
      >
        <ArrowLeftIcon className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t('nav.home')}
      </Link>
    </div>
  );
}
