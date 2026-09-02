import { ArrowRightIcon, Building2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PublicOrganization } from '../../types/api';
import { truncate } from '../../utils/format';
import { Badge } from '../ui/Badge';
import { useI18n } from '../../contexts/i18n';
import { localizedText } from '../../utils/translations';

export function OrganizationCard({
  organization,
  functionCount
}: {
  organization: PublicOrganization;
  functionCount: number;
}) {
  const { locale, t } = useI18n();
  const name = localizedText(organization.name, organization.nameTranslations, locale);
  const description = localizedText(organization.description, organization.descriptionTranslations, locale);

  return (
    <Link
      to={`/organizations/${organization.id}`}
      className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-teal-200 hover:shadow-pop motion-reduce:transform-none sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-navy-100 bg-navy-50 text-navy-700 transition-colors group-hover:border-teal-100 group-hover:bg-teal-50 group-hover:text-teal-700">
          <Building2Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy-100 text-navy-400 transition-colors group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700">
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
        </span>
      </div>

      <h3 className="mt-5 break-words font-display text-base font-bold leading-6 tracking-tight text-navy-950">{name}</h3>
      <p className="mt-2.5 flex-1 break-words text-[13px] leading-6 text-navy-500">{truncate(description, 130)}</p>

      <div className="mt-5 border-t border-navy-100 pt-4">
        <Badge tone="teal">{functionCount} {t('nav.functions')}</Badge>
      </div>
    </Link>
  );
}
