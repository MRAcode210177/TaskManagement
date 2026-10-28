import Link from 'next/link';
import { StatusSelect } from '@/components/tasks/StatusSelect';
import { isOverdue } from '@/lib/task-status';
import type { Task } from '@/lib/types';

/** One task as a card. Used in the member list. */
export function TaskCard({ task }: { task: Task }) {
  const overdue = isOverdue(task);

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 break-words">
          <h2 className="font-medium">
            <Link href={`/member/tasks/${task.id}`} className="hover:underline">
              {task.title}
            </Link>
          </h2>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{task.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-600">
            {task.due_date ? `Due ${task.due_date}` : 'No due date'}
            {overdue && (
              <span className="ml-2 rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                Overdue
              </span>
            )}
          </p>
        </div>
        <StatusSelect taskId={task.id} status={task.status} label={`Status of ${task.title}`} />
      </div>
    </li>
  );
}
