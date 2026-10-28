'use client';

import { useActionState } from 'react';
import { updateTaskStatusAction } from '@/actions/tasks';
import { TASK_STATUSES } from '@/lib/task-status';
import type { TaskStatus } from '@/lib/types';

type Props = {
  taskId: number;
  status: TaskStatus;
  label: string; // for screen readers, for example "Status of Write report"
};

/** A dropdown that saves the new status as soon as you choose it. */
export function StatusSelect({ taskId, status, label }: Props) {
  const [state, formAction, pending] = useActionState(
    updateTaskStatusAction.bind(null, taskId),
    {},
  );

  return (
    <form action={formAction}>
      <select
        // "key" makes the dropdown start fresh when the saved status changes.
        key={status}
        name="status"
        aria-label={label}
        defaultValue={status}
        disabled={pending}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
      >
        {TASK_STATUSES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {state.error && (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}
