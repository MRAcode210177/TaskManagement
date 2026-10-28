import type { TaskStatus } from '@/lib/types';

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
