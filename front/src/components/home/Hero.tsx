import { SearchIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Field';
import { useI18n } from '../../contexts/i18n';
import type { Language, Region } from '../../types/api';

const HERO_IMAGE = '/3e42b6c2-ea58-46c4-a3f2-45342d80cb5b.jpg';

interface HeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  regions: Region[];
  regionId: string;
  onRegionChange: (value: string) => void;
  languages: Language[];
  stats: { organizations: number | null; functions: number | null; regions: number | null };
}

export function Hero({
  query,
  onQueryChange,
  onSubmit,
  regions,
  regionId,
  onRegionChange,
  languages,
  stats
}: HeroProps) {
  const { t, locale, setLocale } = useI18n();

  const statisticItems = [
    { label: t('home.statsOrganizations'), value: stats.organizations },
    { label: t('home.statsFunctions'), value: stats.functions },
    { label: t('home.statsRegions'), value: stats.regions }
  ];

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 text-white">
      <img
        src={HERO_IMAGE}
        alt={t('home.heroImageAlt', 'Zamonaviy davlat idorasi binosi va oldidagi maydon')}
        width={1376}
        height={768}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-25 lg:object-[70%_center]"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,15,28,0.98)_0%,rgba(7,15,28,0.9)_48%,rgba(7,15,28,0.42)_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <span className="inline-flex min-h-8 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 text-xs font-semibold tracking-wide text-teal-100">
            <span className="h-2 w-2 rounded-full bg-flag-green ring-4 ring-flag-green/15" aria-hidden="true" />
            {t('home.heroBadge')}
          </span>

          <h1 className="mt-5 max-w-3xl text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.035em] text-white sm:text-4xl lg:text-[3.4rem]">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-navy-200 sm:text-base">
            {t('home.heroSubtitle')}
          </p>

          <form
            className="mt-8 grid w-full gap-2 rounded-2xl border border-white/15 bg-white p-2 shadow-pop transition-shadow focus-within:ring-4 focus-within:ring-teal-400/25 sm:grid-cols-[minmax(0,1fr)_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit();
            }}
            role="search"
          >
            <label className="flex min-w-0 items-center gap-3 px-3">
              <SearchIcon className="h-5 w-5 shrink-0 text-navy-400" aria-hidden="true" />
              <span className="sr-only">{t('action.search')}</span>
              <input
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={t('home.heroSearchPlaceholder')}
                className="h-12 min-w-0 w-full border-0 bg-transparent text-sm text-navy-950 placeholder:text-navy-400 focus:outline-none"
              />
            </label>
            <Button type="submit" variant="secondary" size="lg" className="w-full sm:w-auto sm:min-w-36">
              {t('action.search')}
            </Button>
          </form>

          <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-navy-900/80 p-3 sm:grid-cols-2">
            <label className="min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-navy-200">{t('field.region')}</span>
              <Select
                value={regionId}
                onChange={(event) => onRegionChange(event.target.value)}
                className="h-11 w-full border-white/15 bg-white/10 text-white hover:border-white/30"
              >
                <option value="" className="text-navy-900">{t('status.all')}</option>
                {regions.map((region) => (
                  <option key={region.id} value={String(region.id)} className="text-navy-900">
                    {region.name}
                  </option>
                ))}
              </Select>
            </label>

            <label className="min-w-0">
              <span className="mb-1.5 block text-xs font-semibold text-navy-200">{t('field.language')}</span>
              <Select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
                className="h-11 w-full border-white/15 bg-white/10 text-white hover:border-white/30"
              >
                {languages.map((language) => (
                  <option key={language.id} value={language.code} className="text-navy-900">
                    {language.nativeName || language.name}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
            {statisticItems.map((stat) => (
              <div key={stat.label} className="min-w-0 px-2 first:pl-0 sm:px-5 sm:first:pl-0">
                <dd className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {stat.value ?? <span aria-label={t('state.loading')}>—</span>}
                </dd>
                <dt className="mt-1 break-words text-[10px] font-medium leading-4 text-navy-300 sm:text-xs">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
