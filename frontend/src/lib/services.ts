import 'server-only';
import { ApiError, apiFetch } from '@/lib/api';
import type { DashboardData, Paginated, Task, TaskStatus, User } from '@/lib/types';
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

/**
 * ALL members of this admin (not only one page).
 * We need the full list for dropdowns. It is fine for small teams.
 */
export async function listAllMembers(): Promise<User[]> {
  const first = await listMembers(1);
  const all = [...first.data];

  // A safety limit of 20 pages, so a bug cannot loop forever.
  for (let page = 2; page <= first.meta.last_page && page <= 20; page++) {
    all.push(...(await listMembers(page)).data);
  }

  return all;
}

// ---------- tasks ----------

export type TaskInput = {
  title: string;
  description: string | null;
  assigned_to: number;
  due_date: string | null;
};

export type TaskFilters = {
  page?: number;
  status?: TaskStatus;
  assignedTo?: number;
};

export function listTasks({ page = 1, status, assignedTo }: TaskFilters = {}) {
  // We add a filter only when it has a value. Laravel never sees empty filters.
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (assignedTo) params.set('assigned_to', String(assignedTo));

  return apiFetch<Paginated<Task>>(`/tasks?${params}`);
}

/** Returns null when Laravel says 404 (not found, or it belongs to another admin). */
export async function getTask(id: number): Promise<Task | null> {
  try {
    const response = await apiFetch<{ data: Task }>(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export function createTask(input: TaskInput) {
  return apiFetch<{ data: Task }>('/tasks', { method: 'POST', body: input });
}

export function updateTask(id: number, input: TaskInput) {
  return apiFetch<{ data: Task }>(`/tasks/${id}`, { method: 'PUT', body: input });
}

export function updateTaskStatus(id: number, status: TaskStatus) {
  return apiFetch<{ data: Task }>(`/tasks/${id}/status`, { method: 'PATCH', body: { status } });
}

export function deleteTask(id: number) {
  return apiFetch<void>(`/tasks/${id}`, { method: 'DELETE' });
}
