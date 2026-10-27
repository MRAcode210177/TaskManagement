'use server';

import { redirect } from 'next/navigation';
import { ApiError, apiFetch } from '../lib/api';
import { homePathFor } from '../lib/auth';
import { clearToken, setToken } from '../lib/session';
import type { FormState, User } from '../lib/types';
import { fieldErrorsFrom, formText, loginSchema, registerSchema } from '../lib/validation';

type AuthResponse = { data: User; token: string };

/** Turn an error into something the form can show. */
function toFormState(error: unknown, values: Record<string, string>): FormState {
  if (error instanceof ApiError) {
    return { error: error.message, fieldErrors: error.errors, values };
  }
  throw error; // an unknown problem: show the Next.js error page
}

export async function loginAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = { email: formText(formData, 'email') };

  const parsed = loginSchema.safeParse({ ...values, password: formText(formData, 'password') });
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values };
  }

  let destination: string;
  try {
    const response = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: parsed.data,
      auth: false,
    });
    await setToken(response.token);
    destination = homePathFor(response.data.role);
  } catch (error) {
    return toFormState(error, values);
  }

  // redirect() works by throwing, so it must be OUTSIDE try/catch.
  redirect(destination);
}

export async function registerAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const values = { name: formText(formData, 'name'), email: formText(formData, 'email') };

  const parsed = registerSchema.safeParse({
    ...values,
    password: formText(formData, 'password'),
    password_confirmation: formText(formData, 'password_confirmation'),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values };
  }

  let destination: string;
  try {
    const response = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: parsed.data,
      auth: false,
    });
    await setToken(response.token);
    destination = homePathFor(response.data.role);
  } catch (error) {
    return toFormState(error, values);
  }

  redirect(destination);
}

export async function logoutAction(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
    // The token may already be invalid. We log out on our side anyway.
  }

  await clearToken();
  redirect('/login');
}
