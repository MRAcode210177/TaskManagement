import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { ApiError, apiFetch } from './api';
import { getToken } from './session';
import type { Role, User } from './types';

/**
 * The logged-in user, or null.
 * cache() = only one API call for one page request, even if many files ask.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  if (!(await getToken())) return null;

  try {
    const response = await apiFetch<{ data: User }>('/auth/me');
    return response.data;
  } catch (error) {
    // The token is old or wrong: treat the person as logged out.
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
});

/** The first page for each role. */
export function homePathFor(role: Role): string {
  return role === 'admin' ? '/admin' : '/member';
}

/**
 * Use this in layouts.
 * Not logged in => /login. Wrong role => the person's own area.
 */
export async function requireRole(role: Role): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== role) redirect(homePathFor(user.role));
  return user;
}
