import Link from 'next/link';
import { TASK_STATUSES } from '@/lib/task-status';
import type { TaskStatus } from '@/lib/types';

type Props = {
  basePath: string; // for example "/member"
  current?: TaskStatus; // the selected tab. Empty means "All"
};

/** Tabs to filter a list by status. Each tab is a normal link. */
export function StatusTabs({ basePath, current }: Props) {
  const tabs = [
    { value: undefined, label: 'All', href: basePath },
    ...TASK_STATUSES.map((status) => ({
      value: status.value,
      label: status.label,
      href: `${basePath}?status=${status.value}`,
    })),
  ];

  return (
    <nav aria-label="Filter tasks by status" className="mb-4 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = tab.value === current;

        return (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-full border px-3 py-1 text-sm ${
              active
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
