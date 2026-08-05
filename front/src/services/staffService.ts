import type {
  CreateModeratorRequest,
  CreateOrgAdminRequest,
  LegacyUserApi,
  PromoteModeratorRequest,
  PromoteOrgAdminRequest,
  RoleName,
  StaffUser,
  UpdateModeratorRequest,
  UpdateOrgAdminRequest
} from '../types/api';
import { apiRequest } from './http';

/* The only endpoint that lists arbitrary users is the legacy /api/user API.
 * Normalize its entity-shaped response before it reaches staff-management UI. */
function roleName(value: LegacyUserApi['role']): RoleName {
  if (typeof value === 'string') return value;
  return value?.name ?? 'ROLE_USER';
}

function organizationIds(value: LegacyUserApi['organizations']): number[] {
  return value
    .map((organization) => typeof organization === 'number' ? organization : organization.id)
    .filter((id): id is number => typeof id === 'number');
}

function normalizeUser(user: LegacyUserApi): StaffUser {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? null,
    role: roleName(user.role),
    enabled: user.enabled,
    organizationIds: organizationIds(user.organizations ?? [])
  };
}

export function getOrgAdmins(): Promise<StaffUser[]> {
  return apiRequest<StaffUser[]>('/api/admin/org-admins');
}

export function getOrgAdmin(id: number): Promise<StaffUser> {
  return apiRequest<StaffUser>(`/api/admin/org-admins/${id}`);
}

export function createOrgAdmin(payload: CreateOrgAdminRequest): Promise<StaffUser> {
  return apiRequest<StaffUser>('/api/admin/org-admins', { method: 'POST', body: payload });
}

export function promoteOrgAdmin(payload: PromoteOrgAdminRequest): Promise<StaffUser> {
  return apiRequest<StaffUser>('/api/admin/org-admins/promote', { method: 'POST', body: payload });
}

export function updateOrgAdmin(id: number, payload: UpdateOrgAdminRequest): Promise<StaffUser> {
  return apiRequest<StaffUser>(`/api/admin/org-admins/${id}`, { method: 'PUT', body: payload });
}

export function deactivateOrgAdmin(id: number): Promise<void> {
  return apiRequest<void>(`/api/admin/org-admins/${id}`, { method: 'DELETE' });
}

export function getModerators(): Promise<StaffUser[]> {
  return apiRequest<StaffUser[]>('/api/admin/moderators');
}

export function getModerator(id: number): Promise<StaffUser> {
  return apiRequest<StaffUser>(`/api/admin/moderators/${id}`);
}

export function createModerator(payload: CreateModeratorRequest): Promise<StaffUser> {
  return apiRequest<StaffUser>('/api/admin/moderators', { method: 'POST', body: payload });
}

export function promoteModerator(payload: PromoteModeratorRequest): Promise<StaffUser> {
  return apiRequest<StaffUser>('/api/admin/moderators/promote', { method: 'POST', body: payload });
}

export function updateModerator(id: number, payload: UpdateModeratorRequest): Promise<StaffUser> {
  return apiRequest<StaffUser>(`/api/admin/moderators/${id}`, { method: 'PUT', body: payload });
}

export function deactivateModerator(id: number): Promise<void> {
  return apiRequest<void>(`/api/admin/moderators/${id}`, { method: 'DELETE' });
}

/**
 * There is no dedicated candidate endpoint in the backend. It is intentionally
 * implemented through GET /api/user and normalized to the public UI shape.
 */
export async function getPromotableUsers(): Promise<StaffUser[]> {
  const users = await apiRequest<LegacyUserApi[]>('/api/user');
  return users.map(normalizeUser);
}
