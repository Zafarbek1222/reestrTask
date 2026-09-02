import { useMemo, useState } from 'react';
import { PencilIcon, PlusIcon, PowerOffIcon, SearchIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/layout/AdminLayout';
import { Panel, PanelHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Field, Select, TextArea, TextInput } from '../../components/ui/Field';
import { ConfirmModal, Modal } from '../../components/ui/Modal';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { useAsync } from '../../hooks/useAsync';
import { useAuth } from '../../contexts/auth';
import { useI18n } from '../../contexts/i18n';
import {
  createOrganization,
  deactivateOrganization,
  getOrganizations,
  updateOrganization } from
'../../services/organizationService';
import type { Organization } from '../../types/api';
import { errorMessage, fieldErrorsOf } from '../../utils/errors';
import { formatDate, truncate } from '../../utils/format';

interface FormState {
  name: string;
  description: string;
}

const emptyForm: FormState = { name: '', description: '' };

export function Organizations() {
  const { t, locale } = useI18n();
  const { isSuperAdmin } = useAuth();
  const organizations = useAsync(getOrganizations, []);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [deactivating, setDeactivating] = useState<Organization | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (organizations.data ?? []).filter((item) => {
      if (status === 'active' && !item.enabled) return false;
      if (status === 'inactive' && item.enabled) return false;
      if (!term) return true;
      return item.name.toLowerCase().includes(term) || (item.description ?? '').toLowerCase().includes(term);
    });
  }, [organizations.data, search, status]);

  const openCreate = () => {
    setForm(emptyForm);
    setErrors({});
    setCreateOpen(true);
  };

  const openEdit = (organization: Organization) => {
    setForm({ name: organization.name, description: organization.description ?? '' });
    setErrors({});
    setEditing(organization);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = t('validation.required');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submitCreate = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await createOrganization({ name: form.name.trim(), description: form.description.trim() || null });
      toast.success(t('toast.created'));
      setCreateOpen(false);
      organizations.reload();
    } catch (error) {
      const fields = fieldErrorsOf(error);
      setErrors(fields);
      if (Object.keys(fields).length === 0) toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const submitEdit = async () => {
    if (!editing || !validate()) return;
    setSaving(true);
    try {
      await updateOrganization(editing.id, {
        name: form.name.trim(),
        description: form.description.trim() || null
      });
      toast.success(t('toast.updated'));
      setEditing(null);
      organizations.reload();
    } catch (error) {
      const fields = fieldErrorsOf(error);
      setErrors(fields);
      if (Object.keys(fields).length === 0) toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const submitDeactivate = async () => {
    if (!deactivating) return;
    setSaving(true);
    try {
      await deactivateOrganization(deactivating.id);
      toast.success(t('toast.deactivated'));
      setDeactivating(null);
      organizations.reload();
    } catch (error) {
      // 409 — e.g. active staff still assigned to this organization.
      toast.error(errorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const columns: Column<Organization>[] = [
  {
    key: 'id',
    header: t('field.id'),
    className: 'hidden lg:table-cell',
    headerClassName: 'hidden lg:table-cell',
    render: (row) => <span className="text-navy-400">#{row.id}</span>
  },
  {
    key: 'name',
    header: t('field.name'),
    render: (row) => <span className="font-medium text-navy-900">{row.name}</span>
  },
  {
    key: 'description',
    header: t('field.description'),
    className: 'hidden md:table-cell',
    headerClassName: 'hidden md:table-cell',
    render: (row) => <span className="text-navy-500">{truncate(row.description, 90)}</span>
  },
  { key: 'enabled', header: t('field.enabled'), render: (row) => <StatusBadge enabled={row.enabled} /> },
  {
    key: 'createdAt',
    header: t('field.createdAt'),
    className: 'hidden xl:table-cell',
    headerClassName: 'hidden xl:table-cell',
    render: (row) => <span className="text-navy-500">{formatDate(row.createdAt, locale)}</span>
  },
  ...(isSuperAdmin ?
  [
  {
    key: 'actions',
    header: t('field.actions'),
    className: 'text-right',
    headerClassName: 'text-right',
    render: (row: Organization) =>
    <div className="flex justify-end gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={t('action.edit')}
                  title={t('action.edit')}
                  className="px-2 xl:px-3"
                  onClick={() => openEdit(row)}
                  icon={<PencilIcon className="h-3.5 w-3.5" />}>
                  <span className="hidden xl:inline">{t('action.edit')}</span>
                </Button>
                {row.enabled &&
      <Button
        size="sm"
        variant="danger"
        aria-label={t('action.deactivate')}
        title={t('action.deactivate')}
        className="px-2 xl:px-3"
        onClick={() => setDeactivating(row)}
        icon={<PowerOffIcon className="h-3.5 w-3.5" />}>
        
                    <span className="hidden xl:inline">{t('action.deactivate')}</span>
                  </Button>
      }
              </div>

  }] :

  [])];


  const formFields =
  <div className="space-y-4">
      <Field label={t('field.name')} error={errors.name} required>
        {({ id, invalid, describedBy }) =>
      <TextInput
        id={id}
        value={form.name}
        maxLength={150}
        invalid={invalid}
        aria-describedby={describedBy}
        onChange={(event) => setForm({ ...form, name: event.target.value })}
        placeholder="Masalan: Adliya vazirligi" />

      }
      </Field>
      <Field label={t('field.description')} error={errors.description} hint={t('field.optional')}>
        {({ id, invalid, describedBy }) =>
      <TextArea
        id={id}
        rows={4}
        value={form.description}
        maxLength={500}
        invalid={invalid}
        aria-describedby={describedBy}
        onChange={(event) => setForm({ ...form, description: event.target.value })} />

      }
      </Field>
    </div>;


  return (
    <div>
      <PageHeader
        title={t('orgs.title')}
        description={t('home.orgsSubtitle')}
        actions={
        isSuperAdmin ?
        <Button onClick={openCreate} icon={<PlusIcon className="h-4 w-4" />}>
              {t('orgs.create')}
            </Button> :
        undefined
        } />
      

      <Panel className="overflow-hidden [&_table]:!min-w-0 [&_td]:!px-3 [&_th]:!px-3 sm:[&_td]:!px-6 sm:[&_th]:!px-6">
        <PanelHeader
          title={`${rows.length} ${t('home.resultsCount')}`}
          actions={
          <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:w-auto">
              <label className="relative">
                <span className="sr-only">{t('action.search')}</span>
                <SearchIcon
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-300"
                aria-hidden="true" />
              
                <TextInput
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t('action.search')}
                className="h-11 w-full pl-9 sm:w-56" />
              
              </label>
              <Select
                value={status}
                aria-label={t('field.status')}
                onChange={(event) => setStatus(event.target.value)}
                className="h-11 sm:w-40">
                <option value="">{t('status.all')}</option>
                <option value="active">{t('status.active')}</option>
                <option value="inactive">{t('status.inactive')}</option>
              </Select>
            </div>
          } />
        
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          loading={organizations.loading}
          error={organizations.error}
          onRetry={organizations.reload}
          emptyTitle={t('state.emptyTitle')}
          emptyDescription={t('state.emptyText')}
          emptyAction={
          isSuperAdmin ?
          <Button size="sm" onClick={openCreate} icon={<PlusIcon className="h-4 w-4" />}>
                {t('orgs.create')}
              </Button> :
          undefined
          }
          caption={t('orgs.title')} />
        
      </Panel>

      <Modal
        open={createOpen}
        title={t('orgs.create')}
        onClose={() => setCreateOpen(false)}
        closeDisabled={saving}
        footer={
        <>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={saving}>
              {t('action.cancel')}
            </Button>
            <Button onClick={submitCreate} loading={saving}>
              {t('action.create')}
            </Button>
          </>
        }>
        
        {formFields}
      </Modal>

      <Modal
        open={Boolean(editing)}
        title={t('orgs.edit')}
        description={editing ? `#${editing.id}` : undefined}
        onClose={() => setEditing(null)}
        closeDisabled={saving}
        footer={
        <>
            <Button variant="outline" onClick={() => setEditing(null)} disabled={saving}>
              {t('action.cancel')}
            </Button>
            <Button onClick={submitEdit} loading={saving}>
              {t('action.save')}
            </Button>
          </>
        }>
        
        {formFields}
      </Modal>

      <ConfirmModal
        open={Boolean(deactivating)}
        title={t('action.deactivate')}
        message={`${deactivating?.name ?? ''} — ${t('orgs.deactivateConfirm')}`}
        confirmLabel={t('action.deactivate')}
        cancelLabel={t('action.cancel')}
        loading={saving}
        onConfirm={submitDeactivate}
        onClose={() => setDeactivating(null)} />
      
    </div>);

}
