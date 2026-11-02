'use client';

import { useActionState } from 'react';
import { updateTaskStatusAction } from '@/actions/tasks';
import { TASK_STATUSES } from '@/lib/task-status';
import type { TaskStatus } from '@/lib/types';

type Props = {
  taskId: number;
  status: TaskStatus;
  label: string;
};

const STATUS_COLOR_CLASSES: Record<TaskStatus, string> = {
  done: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  in_progress:
    'bg-sky-50 text-sky-700 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
  todo: 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800',
};

export function StatusSelect({ taskId, status, label }: Props) {
  const [state, formAction, pending] = useActionState(
    updateTaskStatusAction.bind(null, taskId),
    {},
  );

  const colorClass = STATUS_COLOR_CLASSES[status] ?? STATUS_COLOR_CLASSES.todo;

  return (
    <form action={formAction} className="relative inline-flex items-center">
      <label htmlFor={`status-select-${taskId}`} className="sr-only">
        {label}
      </label>
      <div className="relative inline-block">
        <select
          id={`status-select-${taskId}`}
          key={status}
          name="status"
          aria-label={label}
          defaultValue={status}
          disabled={pending}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className={`cursor-pointer appearance-none rounded-lg border py-1 pl-2.5 pr-7 text-xs font-semibold shadow-2xs transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${colorClass}`}
        >
          {TASK_STATUSES.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          {pending ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <svg
              className="h-3.5 w-3.5 opacity-60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </div>
      </div>
      {state.error && (
        <span role="alert" className="ml-2 text-xs font-medium text-rose-600 dark:text-rose-400">
          {state.error}
        </span>
      )}
    </form>
  );
}
