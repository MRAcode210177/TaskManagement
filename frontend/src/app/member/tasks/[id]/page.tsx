import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusSelect } from '@/components/tasks/StatusSelect';
import { LinkButton } from '@/components/ui/LinkButton';
import { getTask } from '@/lib/services';
import { isOverdue } from '@/lib/task-status';

export const metadata: Metadata = { title: 'Task | Task Management' };

// In Next.js 16, params is a Promise.
type Props = { params: Promise<{ id: string }> };

export default async function MemberTaskPage({ params }: Props) {
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId) || taskId < 1) notFound();

  // Laravel gives 404 for a task that is not yours. We show "not found" too.
  const task = await getTask(taskId);
  if (!task) notFound();

  const overdue = isOverdue(task);

  return (
    <div className="max-w-2xl">
      <PageHeader title={task.title}>
        <LinkButton href="/member" variant="secondary">
          Back to my tasks
        </LinkButton>
      </PageHeader>

      <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-600">Status</dt>
            <dd className="mt-1">
              <StatusSelect
                taskId={task.id}
                status={task.status}
                label={`Status of ${task.title}`}
              />
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Due date</dt>
            <dd className="mt-1">
              {task.due_date ?? 'No due date'}
              {overdue && (
                <span className="ml-2 rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                  Overdue
                </span>
              )}
            </dd>
          </div>
        </dl>

        <div>
          <h2 className="text-sm text-gray-600">Description</h2>
          <p className="mt-1 break-words whitespace-pre-wrap">
            {task.description ?? 'No description.'}
          </p>
        </div>
      </div>
    </div>
  );
}
