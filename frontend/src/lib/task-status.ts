import type { Task, TaskStatus } from '@/lib/types';

/** The 3 statuses, with a friendly label for each. */
export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
];

/** Is this text a real status? Used for URLs and forms. */
export function isTaskStatus(value: string | undefined | null): value is TaskStatus {
  return TASK_STATUSES.some((status) => status.value === value);
}

/** A task is overdue when its due date is before today and it is not done. */
export function isOverdue(task: Pick<Task, 'due_date' | 'status'>): boolean {
  if (!task.due_date || task.status === 'done') return false;

  // "en-CA" writes the date like 2026-10-27, so we can compare it as text.
  const today = new Date().toLocaleDateString('en-CA');
  return task.due_date < today;
}
