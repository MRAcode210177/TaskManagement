import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusSelect } from '@/components/tasks/StatusSelect';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { LinkButton } from '@/components/ui/LinkButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getTask } from '@/lib/services';
import { isOverdue } from '@/lib/task-status';

export const metadata: Metadata = { title: 'Task Details | TaskStream' };

type Props = { params: Promise<{ id: string }> };

export default async function MemberTaskPage({ params }: Props) {
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId) || taskId < 1) notFound();

  const task = await getTask(taskId);
  if (!task) notFound();

  const overdue = isOverdue(task);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title={task.title}
        badge={<StatusBadge status={task.status} isOverdue={overdue} />}
        subtitle={`Task ID #${task.id} • Assigned in sprint workspace`}
      >
        <LinkButton href="/member" variant="secondary" size="sm">
          ← Back to My Workspace
        </LinkButton>
      </PageHeader>

      {overdue && (
        <AlertBanner
          title="This task is overdue"
          message={`Target deadline was ${task.due_date}. Please update the progress status below or contact your supervisor.`}
          variant="danger"
        />
      )}

      <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs dark:border-slate-800/90 dark:bg-slate-900/80 space-y-6">
        {/* Status and Due Date */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border-b border-slate-100 pb-6 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Update Current Status
            </span>
            <div className="mt-2">
              <StatusSelect
                taskId={task.id}
                status={task.status}
                label={`Status of ${task.title}`}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Selecting a new status automatically synchronizes with your team administrator.
            </p>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Target Deadline
            </span>
            <div className="mt-2 flex items-center gap-2">
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span
                className={`text-sm font-semibold ${overdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}
              >
                {task.due_date ? task.due_date : 'No deadline assigned'}
              </span>
              {overdue && (
                <span className="rounded bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  Overdue
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Task description */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Task Specifications & Notes
          </span>
          <div className="mt-2 rounded-lg bg-slate-50 p-4 text-xs sm:text-sm text-slate-700 dark:bg-slate-850 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            {task.description
              ? task.description
              : 'No additional description provided for this task.'}
          </div>
        </div>

        {/* Audit footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          <span>
            Created on {task.created_at ? new Date(task.created_at).toLocaleDateString() : 'N/A'}
          </span>
          <span>
            Last modified {task.updated_at ? new Date(task.updated_at).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
