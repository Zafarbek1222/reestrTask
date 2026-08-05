import type {
  CreateLegacyUserRequest,
  LegacyUser,
  LegacyUserApi,
  RoleEntity,
  UpdateLegacyUserRequest
} from '../types/api';
import { ApiError, apiRequest } from './http';

/**
 * The backend exposes these endpoints as raw JPA entities. The frontend strips
 * password data and converts nested role/organization objects to safe values.
 * GET /api/user/profile is intentionally not implemented.
 */
function normalize(user: LegacyUserApi): LegacyUser {
  const role = typeof user.role === 'string' ? user.role : user.role?.name ?? 'ROLE_USER';
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? null,
    role,
    enabled: user.enabled,
    organizations: (user.organizations ?? [])
      .map((organization) => typeof organization === 'number' ? organization : organization.id)
      .filter((id): id is number => typeof id === 'number')
  };
}

export async function getLegacyUsers(): Promise<LegacyUser[]> {
  const users = await apiRequest<LegacyUserApi[]>('/api/user');
  return users.map(normalize);
}

export async function getLegacyUser(id: number): Promise<LegacyUser> {
  return normalize(await apiRequest<LegacyUserApi>(`/api/user/${id}`));
}

/**
 * The raw endpoint needs Role and Organization entity references, not role and
 * organization ID primitives. Resolve the role first and send ID references.
 */
export async function createLegacyUser(payload: CreateLegacyUserRequest): Promise<LegacyUser> {
  const roles = await apiRequest<RoleEntity[]>('/api/roles');
  const selectedRole = roles.find((role) => role.name === payload.role);
  if (!selectedRole) throw new ApiError(400, `Role not found: ${payload.role}`);

  const created = await apiRequest<LegacyUserApi>('/api/user', {
    method: 'POST',
    body: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
      phone: payload.phone || null,
      role: { id: selectedRole.id },
      enabled: payload.enabled,
      organizations: payload.organizations.map((id) => ({ id }))
    }
  });
  return normalize(created);
}

/** Backend updates only firstName, lastName and email for this endpoint. */
export async function updateLegacyUser(id: number, payload: UpdateLegacyUserRequest): Promise<LegacyUser> {
  return normalize(await apiRequest<LegacyUserApi>(`/api/user/${id}`, { method: 'PUT', body: payload }));
}

export function deleteLegacyUser(id: number): Promise<void> {
  return apiRequest<void>(`/api/user/${id}`, { method: 'DELETE' });
}
