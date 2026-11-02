import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeleteTaskButton } from '@/components/tasks/DeleteTaskButton';
import { StatusSelect } from '@/components/tasks/StatusSelect';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { Pagination } from '@/components/ui/Pagination';
import { getDashboard, listAllMembers, listTasks } from '@/lib/services';
import { isOverdue, isTaskStatus } from '@/lib/task-status';

export const metadata: Metadata = { title: 'Tasks Registry | TaskPilot' };

type Props = {
  searchParams: Promise<{ page?: string; status?: string; assigned_to?: string }>;
};

export default async function TasksPage({ searchParams }: Props) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
  const status = isTaskStatus(params.status) ? params.status : undefined;
  const assignedTo = Number.parseInt(params.assigned_to ?? '', 10) || undefined;
  const hasFilters = status !== undefined || assignedTo !== undefined;

  const [tasks, members, dashboard] = await Promise.all([
    listTasks({ page: currentPage, status, assignedTo }),
    listAllMembers(),
    getDashboard(),
  ]);

  const hrefFor = (page: number) => {
    const query = new URLSearchParams({ page: String(page) });
    if (status) query.set('status', status);
    if (assignedTo) query.set('assigned_to', String(assignedTo));
    return `/admin/tasks?${query}`;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Active Tasks Registry"
        badge={
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {tasks.meta.total} Total
          </span>
        }
        subtitle="Manage sprint tasks, assignees, deadlines, and live execution status."
      >
        <LinkButton href="/admin/tasks/new" variant="primary" size="md">
          + Create Task
        </LinkButton>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900/80">
            <TaskFilters
              status={status}
              assignedTo={assignedTo}
              members={members}
              totalTasksCount={tasks.meta.total}
            />

            {tasks.data.length === 0 ? (
              hasFilters ? (
                <EmptyState
                  title="No tasks match these filters"
                  text="Try clearing or adjusting filters."
                >
                  <LinkButton href="/admin/tasks" variant="secondary" size="sm">
                    Clear filters
                  </LinkButton>
                </EmptyState>
              ) : (
                <EmptyState
                  title="No tasks yet"
                  text="Create your first sprint task to assign to members."
                >
                  <LinkButton href="/admin/tasks/new" variant="primary">
                    + Create Task
                  </LinkButton>
                </EmptyState>
              )
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800/80">
                <table className="min-w-full divide-y divide-slate-100 text-left text-xs dark:divide-slate-800">
                  <thead className="bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                    <tr>
                      <th scope="col" className="w-8 px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          aria-label="Select all"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                        />
                      </th>
                      <th scope="col" className="px-3.5 py-3 font-semibold">
                        TASK DETAILS
                      </th>
                      <th scope="col" className="px-3.5 py-3 font-semibold">
                        ASSIGNED MEMBER
                      </th>
                      <th scope="col" className="px-3.5 py-3 font-semibold">
                        CURRENT STATUS
                      </th>
                      <th scope="col" className="px-3.5 py-3 font-semibold whitespace-nowrap">
                        DUE DATE
                      </th>
                      <th scope="col" className="px-3.5 py-3 text-right font-semibold">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800/60 dark:bg-slate-900/60">
                    {tasks.data.map((task) => {
                      const isTaskOverdue = isOverdue(task);
                      const isDone = task.status === 'done';

                      return (
                        <tr
                          key={task.id}
                          className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-850/50"
                        >
                          <td className="px-3 py-3.5 text-center">
                            <input
                              type="checkbox"
                              defaultChecked={isDone}
                              aria-label={`Select task ${task.title}`}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                            />
                          </td>
                          <td className="px-3.5 py-3.5 max-w-xs">
                            <div className="min-w-0">
                              <p
                                className={`font-semibold text-xs ${
                                  isDone
                                    ? 'text-slate-400 line-through dark:text-slate-500'
                                    : 'text-slate-900 dark:text-white'
                                }`}
                              >
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400">
                                  {task.description}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-3.5 py-3.5 whitespace-nowrap">
                            {task.assignee ? (
                              <div className="flex items-center gap-2">
                                <Avatar name={task.assignee.name} id={task.assignee.id} size="xs" />
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {task.assignee.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                                    {task.assignee.email}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="px-3.5 py-3.5 whitespace-nowrap">
                            <StatusSelect
                              taskId={task.id}
                              status={task.status}
                              label={`Status of ${task.title}`}
                            />
                          </td>
                          <td className="px-3.5 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                            {task.due_date ? (
                              <div className="flex items-center gap-1.5">
                                <svg
                                  className={`h-3.5 w-3.5 ${
                                    isTaskOverdue ? 'text-rose-500' : 'text-slate-400'
                                  }`}
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
                                  className={
                                    isTaskOverdue
                                      ? 'font-bold text-rose-600 dark:text-rose-400'
                                      : ''
                                  }
                                >
                                  {task.due_date}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="px-3.5 py-3.5 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <LinkButton
                                href={`/admin/tasks/${task.id}`}
                                variant="secondary"
                                size="xs"
                              >
                                Edit
                              </LinkButton>
                              <DeleteTaskButton id={task.id} title={task.title} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <Pagination
              currentPage={tasks.meta.current_page}
              lastPage={tasks.meta.last_page}
              hrefFor={hrefFor}
            />
          </div>
        </section>

        <div className="lg:col-span-4">
          <AdminSidebar members={members} dashboard={dashboard} />
        </div>
      </div>
    </div>
  );
}
