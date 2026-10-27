import 'server-only';
import { ApiError, apiFetch } from '@/lib/api';
import type { DashboardData, Paginated, User } from '@/lib/types';

/**
 * The SERVICE LAYER: the only place that knows the Laravel addresses.
 * Pages and actions call these functions.
 */

// ---------- dashboard ----------

export async function getDashboard(): Promise<DashboardData> {
  const response = await apiFetch<{ data: DashboardData }>('/dashboard');
  return response.data;
}

// ---------- members ----------

export function listMembers(page = 1): Promise<Paginated<User>> {
  return apiFetch<Paginated<User>>(`/members?page=${page}`);
}

/** Returns null when Laravel says 404 (not found, or it belongs to another admin). */
export async function getMember(id: number): Promise<User | null> {
  try {
    const response = await apiFetch<{ data: User }>(`/members/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function createMember(input: { name: string; email: string; password: string }) {
  return apiFetch<{ data: User }>('/members', { method: 'POST', body: input });
}

export function updateMember(
  id: number,
  input: { name?: string; email?: string; password?: string },
) {
  return apiFetch<{ data: User }>(`/members/${id}`, { method: 'PUT', body: input });
}

export function deleteMember(id: number) {
  return apiFetch<void>(`/members/${id}`, { method: 'DELETE' });
}
