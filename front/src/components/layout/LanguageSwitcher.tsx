import { useId } from 'react';
import { ChevronDownIcon, GlobeIcon } from 'lucide-react';
import { useI18n } from '../../contexts/i18n';

export function LanguageSwitcher({
  tone = 'dark',
  compact = false
}: {
  tone?: 'dark' | 'light';
  compact?: boolean;
}) {
  const { locale, setLocale, available, t } = useI18n();
  const selectId = useId();
  const isLight = tone === 'light';
  const currentIsAvailable = available.some((item) => item.code.toLowerCase() === locale.toLowerCase());

  return (
    <div className="relative inline-flex min-h-11 max-w-full items-center">
      <label htmlFor={selectId} className="sr-only">
        {t('field.language')}
      </label>
      <GlobeIcon
        className={`pointer-events-none absolute left-3 h-4 w-4 ${isLight ? 'text-white/85' : 'text-content-muted'}`}
        aria-hidden="true"
      />
      <select
        id={selectId}
        value={locale}
        onChange={(event) => setLocale(event.target.value)}
        className={`min-h-11 ${compact ? 'max-w-32' : 'max-w-[11rem]'} cursor-pointer appearance-none truncate rounded-control border py-2 pl-9 pr-9 text-sm font-semibold transition-[background-color,border-color,color,box-shadow] duration-fast focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus/20 ${
          isLight
            ? 'border-white/25 bg-transparent text-white hover:border-white/40 hover:bg-white/10'
            : 'border-line bg-surface text-content hover:border-line-strong hover:bg-surface-subtle'
        }`}>
        {!currentIsAvailable && <option value={locale}>{locale}</option>}
        {available.map((item) =>
        <option key={item.code} value={item.code} className="bg-white text-navy-900">
            {item.label}
          </option>
        )}
      </select>
      <ChevronDownIcon
        className={`pointer-events-none absolute right-3 h-4 w-4 ${isLight ? 'text-white/75' : 'text-content-muted'}`}
        aria-hidden="true"
      />
    </div>);

}
