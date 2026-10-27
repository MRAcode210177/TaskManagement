'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { requireRole } from '@/lib/auth';
import { toFormState } from '@/lib/form-state';
import { createMember, deleteMember, updateMember } from '@/lib/services';
import type { FormState } from '@/lib/types';
import {
  fieldErrorsFrom,
  formText,
  memberCreateSchema,
  memberUpdateSchema,
} from '@/lib/validation';

// Server Actions are public web addresses. So EVERY action checks the role first.
// (Laravel checks it again. That is the real protection.)

export async function createMemberAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole('admin');

  const values = { name: formText(formData, 'name'), email: formText(formData, 'email') };
  const parsed = memberCreateSchema.safeParse({
    ...values,
    password: formText(formData, 'password'),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values };
  }

  try {
    await createMember(parsed.data);
  } catch (error) {
    return toFormState(error, values);
  }

  revalidatePath('/admin/members');
  revalidatePath('/admin');
  redirect('/admin/members');
}

// "id" comes first because the page fixes it with .bind(null, id).
export async function updateMemberAction(
  id: number,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole('admin');

  const values = { name: formText(formData, 'name'), email: formText(formData, 'email') };
  const password = formText(formData, 'password');
  const parsed = memberUpdateSchema.safeParse({
    ...values,
    password: password === '' ? undefined : password, // empty = keep the old password
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values };
  }

  try {
    await updateMember(id, parsed.data);
  } catch (error) {
    return toFormState(error, values);
  }

  revalidatePath('/admin/members');
  redirect('/admin/members');
}

export async function deleteMemberAction(id: number): Promise<void> {
  await requireRole('admin');

  try {
    await deleteMember(id);
  } catch (error) {
    // Already deleted? Fine. Any other problem shows the error page.
    if (!(error instanceof ApiError && error.status === 404)) throw error;
  }

  revalidatePath('/admin/members');
  revalidatePath('/admin');
}
