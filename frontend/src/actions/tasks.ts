'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { requireRole, requireUser } from '@/lib/auth';
import { toFormState } from '@/lib/form-state';
import {
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
  type TaskInput,
} from '@/lib/services';
import { isTaskStatus } from '@/lib/task-status';
import type { FormState } from '@/lib/types';
import { fieldErrorsFrom, formText, taskSchema } from '@/lib/validation';

/** Read the 4 task fields from a form. */
function readTaskForm(formData: FormData) {
  return {
    title: formText(formData, 'title'),
    description: formText(formData, 'description'),
    assigned_to: formText(formData, 'assigned_to'),
    due_date: formText(formData, 'due_date'),
  };
}

/** Form texts -> what Laravel wants (numbers, and null for empty). */
function toTaskInput(data: ReturnType<typeof readTaskForm>): TaskInput {
  return {
    title: data.title,
    description: data.description === '' ? null : data.description,
    assigned_to: Number(data.assigned_to),
    due_date: data.due_date === '' ? null : data.due_date,
  };
}

function refreshTaskPages() {
  revalidatePath('/admin/tasks');
  revalidatePath('/admin');
  revalidatePath('/member');
}

export async function createTaskAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole('admin');

  const values = readTaskForm(formData);
  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values };
  }

  try {
    await createTask(toTaskInput(parsed.data));
  } catch (error) {
    return toFormState(error, values);
  }

  refreshTaskPages();
  redirect('/admin/tasks');
}

export async function updateTaskAction(
  id: number,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireRole('admin');

  const values = readTaskForm(formData);
  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values };
  }

  try {
    await updateTask(id, toTaskInput(parsed.data));
  } catch (error) {
    return toFormState(error, values);
  }

  refreshTaskPages();
  redirect('/admin/tasks');
}

export async function deleteTaskAction(id: number): Promise<void> {
  await requireRole('admin');

  try {
    await deleteTask(id);
  } catch (error) {
    // Already deleted? Fine. Any other problem shows the error page.
    if (!(error instanceof ApiError && error.status === 404)) throw error;
  }

  refreshTaskPages();
}

/**
 * Change the status. Admin AND member may call this.
 * Laravel decides if the task really belongs to the person.
 */
export async function updateTaskStatusAction(
  id: number,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireUser();

  const status = formText(formData, 'status');
  if (!isTaskStatus(status)) {
    return { error: 'Choose a valid status.' };
  }

  try {
    await updateTaskStatus(id, status);
  } catch (error) {
    return toFormState(error, {});
  }

  refreshTaskPages();
  return {};
}
