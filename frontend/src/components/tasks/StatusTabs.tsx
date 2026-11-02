import Link from 'next/link';
import { TASK_STATUSES } from '@/lib/task-status';
import type { TaskStatus } from '@/lib/types';

type Props = {
  basePath: string;
  current?: TaskStatus | 'overdue';
  counts?: {
    all?: number;
    todo?: number;
    in_progress?: number;
    done?: number;
    overdue?: number;
  };
};

export function StatusTabs({ basePath, current, counts }: Props) {
  const tabs: { value?: TaskStatus | 'overdue'; label: string; count?: number; href: string }[] = [
    { value: undefined, label: 'All', count: counts?.all, href: basePath },
    ...TASK_STATUSES.map((status) => ({
      value: status.value,
      label: status.label,
      count: counts?.[status.value],
      href: `${basePath}?status=${status.value}`,
    })),
    {
      value: 'overdue',
      label: 'Overdue',
      count: counts?.overdue,
      href: `${basePath}?status=overdue`,
    },
  ];

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <nav aria-label="Filter tasks by status" className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => {
          const active = tab.value === current;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
                active
                  ? tab.value === 'overdue'
                    ? 'bg-rose-600 text-white shadow-xs shadow-rose-600/30'
                    : 'bg-blue-600 text-white shadow-xs shadow-blue-600/30 dark:bg-blue-600'
                  : tab.value === 'overdue'
                    ? 'border border-rose-200/80 bg-rose-50/50 text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* View Toggle Icons (UI feature - Image 5) */}
      <div className="hidden sm:flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          title="Grid view"
          className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </button>
        <button
          type="button"
          title="List view"
          className="rounded-md bg-slate-100 p-1.5 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <button
          type="button"
          title="Compact cards"
          className="rounded-md p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
