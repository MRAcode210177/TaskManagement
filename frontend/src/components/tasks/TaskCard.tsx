import Link from 'next/link';
import { StatusSelect } from '@/components/tasks/StatusSelect';
import { isOverdue } from '@/lib/task-status';
import type { Task } from '@/lib/types';

export function TaskCard({ task }: { task: Task }) {
  const overdue = isOverdue(task);
  const isDone = task.status === 'done';
  const isInProgress = task.status === 'in_progress';

  // Border and background accents
  const borderAccent = overdue
    ? 'border-l-4 border-l-rose-500 bg-rose-50/30 dark:bg-rose-950/20'
    : isDone
      ? 'border-l-4 border-l-emerald-500 bg-white dark:bg-slate-900/80'
      : isInProgress
        ? 'border-l-4 border-l-sky-500 bg-white dark:bg-slate-900/80'
        : 'border-l-4 border-l-amber-400 bg-white dark:bg-slate-900/80';

  return (
    <li
      className={`rounded-xl border border-slate-200/90 p-5 shadow-xs transition-all duration-150 hover:shadow-md dark:border-slate-800/90 ${borderAccent}`}
    >
      <div className="flex flex-col gap-3">
        {/* Top meta row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status indicator */}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isDone
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                  : isInProgress
                    ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isDone ? 'bg-emerald-500' : isInProgress ? 'bg-sky-500' : 'bg-amber-500'
                }`}
              />
              {isDone ? 'Completed' : isInProgress ? 'In Progress' : 'To Do'}
            </span>

            {/* Due date badge */}
            {task.due_date && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                  overdue
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 ring-1 ring-rose-500/30'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {overdue ? `Due ${task.due_date} • Overdue` : `Due: ${task.due_date}`}
              </span>
            )}

            {overdue && (
              <span className="rounded bg-rose-600 px-1.5 py-0.2 text-[10px] font-bold tracking-wider text-white uppercase">
                Urgent
              </span>
            )}
          </div>

          {/* Quick status selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Change Status:
            </span>
            <StatusSelect
              taskId={task.id}
              status={task.status}
              label={`Change status for ${task.title}`}
            />
          </div>
        </div>

        {/* Task Title & Description */}
        <div className="space-y-1">
          <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            <Link
              href={`/member/tasks/${task.id}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
            >
              {task.title}
            </Link>
          </h2>

          {task.description && (
            <p className="text-xs text-slate-600 line-clamp-2 dark:text-slate-400">
              {task.description}
            </p>
          )}
        </div>

        {/* Bottom footer bar with context pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
            {isDone ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Marked finished
              </span>
            ) : overdue ? (
              <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                Action required on overdue assignment
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                Priority: <strong className="text-slate-700 dark:text-slate-300">Medium</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/member/tasks/${task.id}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
            >
              View details →
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}
