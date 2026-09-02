import { useState } from 'react';
import type { FormEvent } from 'react';
import { KeyRoundIcon, ShieldCheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../components/layout/AdminLayout';
import { Panel, PanelBody, PanelHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Field, TextInput } from '../components/ui/Field';
import { useAuth } from '../contexts/auth';
import { useI18n } from '../contexts/i18n';
import { changePassword } from '../services/authService';
import { errorMessage, fieldErrorsOf } from '../utils/errors';
import { fullName, initials, roleLabel } from '../utils/format';

/** NOTE: /api/user/profile is never called — account data comes from GET /api/auth/me. */
export function SecuritySettings() {
  const { t } = useI18n();
  const { user, refreshUser } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!currentPassword) next.currentPassword = t('validation.required');
    if (newPassword.length < 8 || newPassword.length > 100) next.newPassword = t('security.passwordRule');
    if (newPassword !== repeatPassword) next.repeatPassword = t('security.mismatch');
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await changePassword({ currentPassword, newPassword });
      await refreshUser();
      toast.success(t('security.success'));
      setCurrentPassword('');
      setNewPassword('');
      setRepeatPassword('');
    } catch (error) {
      const fields = fieldErrorsOf(error);
      setErrors(fields);
      if (Object.keys(fields).length === 0) toast.error(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title={t('security.title')} description={t('security.passwordRule')} />

      <div className="grid gap-6 xl:grid-cols-5">
        <Panel className="overflow-hidden xl:col-span-3">
          <PanelHeader title={t('security.changePassword')} />
          <PanelBody>
            <form className="max-w-lg space-y-5" onSubmit={handleSubmit} noValidate>
              <Field label={t('security.currentPassword')} error={errors.currentPassword} required>
                {({ id, invalid, describedBy }) =>
                <TextInput
                  id={id}
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  onChange={(event) => setCurrentPassword(event.target.value)} />

                }
              </Field>
              <Field
                label={t('security.newPassword')}
                error={errors.newPassword}
                hint={t('security.passwordRule')}
                required>
                
                {({ id, invalid, describedBy }) =>
                <TextInput
                  id={id}
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  minLength={8}
                  maxLength={100}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  onChange={(event) => setNewPassword(event.target.value)} />

                }
              </Field>
              <Field label={t('security.repeatPassword')} error={errors.repeatPassword} required>
                {({ id, invalid, describedBy }) =>
                <TextInput
                  id={id}
                  type="password"
                  autoComplete="new-password"
                  value={repeatPassword}
                  minLength={8}
                  maxLength={100}
                  invalid={invalid}
                  aria-describedby={describedBy}
                  onChange={(event) => setRepeatPassword(event.target.value)} />

                }
              </Field>
              <div className="border-t border-navy-100 pt-5">
                <Button type="submit" loading={submitting} icon={<KeyRoundIcon className="h-4 w-4" />}>
                  {t('action.save')}
                </Button>
              </div>
            </form>
          </PanelBody>
        </Panel>

        <Panel className="h-fit overflow-hidden xl:sticky xl:top-24 xl:col-span-2">
          <PanelHeader title={t('admin.welcome')} />
          <PanelBody className="text-sm">
            {user ?
            <>
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/70 p-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-xs font-bold tracking-wide text-white">
                    {initials(user)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-navy-900">{fullName(user)}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[12px] font-medium text-teal-700">
                      <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      {roleLabel(user.role, t)}
                    </span>
                  </span>
                </div>
                <dl className="divide-y divide-navy-100 text-[13px]">
                  <div className="py-3 first:pt-0">
                    <dt className="text-navy-400">{t('field.fullName')}</dt>
                    <dd className="font-medium text-navy-900">{fullName(user)}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="text-navy-400">{t('field.email')}</dt>
                    <dd className="font-medium text-navy-900">{user.email}</dd>
                  </div>
                  <div className="py-3">
                    <dt className="text-navy-400">{t('field.phone')}</dt>
                    <dd className="font-medium text-navy-900">{user.phone ?? '—'}</dd>
                  </div>
                  <div className="py-3 last:pb-0">
                    <dt className="text-navy-400">{t('field.organizationIds')}</dt>
                    <dd className="font-medium text-navy-900">
                      {user.organizationIds.length > 0 ? user.organizationIds.join(', ') : '—'}
                    </dd>
                  </div>
                </dl>
              </> :
            null}
          </PanelBody>
        </Panel>
      </div>
    </div>);

}
