'use client';

import { Button } from '@/components/ui/Button';
import { LinkButton } from '@/components/ui/LinkButton';
import { TASK_STATUSES } from '@/lib/task-status';
import type { TaskStatus, User } from '@/lib/types';

type Props = {
  status?: TaskStatus;
  assignedTo?: number;
  members: User[];
  totalTasksCount?: number;
};

export function TaskFilters({ status, assignedTo, members, totalTasksCount }: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
      {/* Form controls */}
      <form method="get" action="/admin/tasks" className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-2">
          <label
            htmlFor="filter-status"
            className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400"
          >
            Status:
          </label>
          <select
            id="filter-status"
            name="status"
            defaultValue={status ?? ''}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
          >
            <option value="">All</option>
            {TASK_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="filter-member"
            className="text-xs font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400"
          >
            Member:
          </label>
          <select
            id="filter-member"
            name="assigned_to"
            defaultValue={assignedTo ? String(assignedTo) : ''}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs transition-colors hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700"
          >
            <option value="">All Members</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" variant="secondary" size="sm">
          Filter
        </Button>

        {(status !== undefined || assignedTo !== undefined) && (
          <LinkButton href="/admin/tasks" variant="ghost" size="sm">
            Clear
          </LinkButton>
        )}
      </form>

      {/* Right side helper info (Image 4) */}
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        {totalTasksCount !== undefined && (
          <span className="hidden md:inline-flex rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            {totalTasksCount} Total
          </span>
        )}
        <span className="hidden sm:inline">
          Sort: <strong className="text-slate-700 dark:text-slate-300">Due Date (Asc)</strong>
        </span>
        <button
          type="button"
          onClick={() => {
            alert(
              'Export CSV feature preview: Real data export will be available in future releases.',
            );
          }}
          className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Export CSV
        </button>
      </div>
    </div>
  );
}
