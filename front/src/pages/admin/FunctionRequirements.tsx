import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, InfoIcon, LockIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/layout/AdminLayout';
import { Panel, PanelBody, PanelHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Field, TextArea } from '../../components/ui/Field';
import { Badge } from '../../components/ui/Badge';
import { SkeletonText } from '../../components/ui/Skeleton';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../contexts/auth';
import { useI18n } from '../../contexts/i18n';
import { getFunction, updateFunctionRequirements } from '../../services/functionService';
import { getOrganizations } from '../../services/organizationService';
import { errorMessage, fieldErrorsOf } from '../../utils/errors';

export function FunctionRequirements() {
  const { id } = useParams<{id: string;}>();
  const functionId = Number(id);
  const { t } = useI18n();
  const { user, hasRole } = useAuth();

  const item = useAsync(() => getFunction(functionId), [functionId]);
  const organizations = useAsync(getOrganizations, []);

  const [requirements, setRequirements] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item.data) setRequirements(item.data.requirements ?? '');
  }, [item.data]);

  const organization = (organizations.data ?? []).find((org) => org.id === item.data?.organizationId);

  const roleAllowed = hasRole('ROLE_SUPER_ADMIN', 'ROLE_ORG_ADMIN');
  const scopeAllowed =
  user?.role === 'ROLE_SUPER_ADMIN' || (
  user?.role === 'ROLE_ORG_ADMIN' && item.data ? user.organizationIds.includes(item.data.organizationId) : false);
  const canSave = roleAllowed && scopeAllowed;

  const submit = async () => {
    if (!requirements.trim()) {
      setErrors({ requirements: t('validation.required') });
      return;
    }
    setSaving(true);
    try {
      const updated = await updateFunctionRequirements(functionId, { requirements });
      item.setData(updated);
      toast.success(t('toast.updated'));
      setErrors({});
    } catch (error) {
      const fields = fieldErrorsOf(error);
      setErrors(fields);
      if (Object.keys(fields).length === 0) toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link
        to="/admin"
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-[13px] font-semibold text-navy-500 transition-colors hover:bg-white hover:text-navy-900 hover:shadow-sm">
        
        <ArrowLeftIcon className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
        {t('nav.dashboard')}
      </Link>

      <div className="mt-4">
        <PageHeader
          title={t('fnEdit.title')}
          description={item.data?.name}
          badge={item.data?.category ? <Badge tone="teal">{item.data.category}</Badge> : undefined} />
        
      </div>

      {item.loading ?
      <Panel>
          <PanelBody>
            <SkeletonText lines={6} />
          </PanelBody>
        </Panel> :
      item.error ?
      <Panel>
          <ErrorState error={item.error} onRetry={item.reload} />
        </Panel> :
      item.data ?
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <Panel className="overflow-hidden">
            <PanelHeader title={t('field.requirements')} description={t('fnEdit.hint')} />
            <PanelBody>
              {canSave ?
            <div className="space-y-4">
                  <Field label={t('field.requirements')} error={errors.requirements} hint={t('fnEdit.hint')} required>
                    {({ id: fieldId, invalid, describedBy }) =>
                <TextArea
                  id={fieldId}
                  rows={12}
                  value={requirements}
                  maxLength={500}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  onChange={(event) => setRequirements(event.target.value)}
                  className="min-h-72 resize-y text-sm leading-6" />

                }
                  </Field>
                  <div className="flex flex-col-reverse gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
                    <p className="text-[12px] tabular-nums text-navy-400">{requirements.length} / 500</p>
                    <Button onClick={submit} loading={saving} icon={<SaveIcon className="h-4 w-4" />}>
                      {t('action.save')}
                    </Button>
                  </div>
                </div> :

            <>
                  <EmptyState
                title={t('state.forbidden')}
                description={t('state.forbidden')}
                icon={<LockIcon className="h-5 w-5" />} />
              
                  <div className="rounded-xl border border-navy-100 bg-navy-50 p-4 sm:p-5">
                    <p className="whitespace-pre-line text-[13px] leading-relaxed text-navy-600">
                      {item.data.requirements ?? t('fn.requirementsEmpty')}
                    </p>
                  </div>
                </>
            }
            </PanelBody>
          </Panel>

          <Panel className="h-fit overflow-hidden xl:sticky xl:top-24">
            <PanelHeader title={t('fn.aboutTitle')} />
            <PanelBody className="divide-y divide-navy-100 p-0 text-[13px] sm:p-0">
              <div className="px-5 py-4">
                <p className="text-navy-400">{t('field.id')}</p>
                <p className="font-medium text-navy-900">#{item.data.id}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-navy-400">{t('field.name')}</p>
                <p className="font-medium text-navy-900">{item.data.name}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-navy-400">{t('field.organization')}</p>
                <p className="font-medium text-navy-900">{organization?.name ?? `#${item.data.organizationId}`}</p>
              </div>
              <div className="px-5 py-4">
                <p className="text-navy-400">{t('field.description')}</p>
                <p className="leading-relaxed text-navy-600">{item.data.description ?? '—'}</p>
              </div>
              <div className="px-5 py-4">
                <p className="flex items-start gap-2 rounded-xl bg-navy-50 p-3 text-[12px] leading-relaxed text-navy-500">
                  <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Saqlash faqat SUPER_ADMIN yoki tashkilotga biriktirilgan ORG_ADMIN uchun mavjud.
                </p>
              </div>
            </PanelBody>
          </Panel>
        </div> :
      null}
    </div>);

}
