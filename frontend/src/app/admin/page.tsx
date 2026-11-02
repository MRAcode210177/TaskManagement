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
import { StatCard } from '@/components/ui/StateCard';
import { getDashboard, listAllMembers, listTasks } from '@/lib/services';
import { isOverdue, isTaskStatus } from '@/lib/task-status';

export const metadata: Metadata = { title: 'Dashboard & Task Operations | TaskPilot' };

type Props = {
  searchParams: Promise<{ page?: string; status?: string; assigned_to?: string }>;
};

export default async function AdminHomePage({ searchParams }: Props) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
  const status = isTaskStatus(params.status) ? params.status : undefined;
  const assignedTo = Number.parseInt(params.assigned_to ?? '', 10) || undefined;
  const hasFilters = status !== undefined || assignedTo !== undefined;

  const [data, tasks, members] = await Promise.all([
    getDashboard(),
    listTasks({ page: currentPage, status, assignedTo }),
    listAllMembers(),
  ]);

  const { todo, in_progress, done } = data.tasks_by_status;
  const overdueCount = tasks.data.filter((t) => isOverdue(t)).length;

  const memberNamesPreview =
    members.length > 0
      ? members
          .slice(0, 3)
          .map((m) => m.name.split(' ')[0])
          .join(', ')
      : 'No active members';

  const hrefFor = (page: number) => {
    const query = new URLSearchParams({ page: String(page) });
    if (status) query.set('status', status);
    if (assignedTo) query.set('assigned_to', String(assignedTo));
    return `/admin?${query}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header (Image 4) */}
      <PageHeader
        title="Dashboard & Task Operations"
        badge={
          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            Sprint 42
          </span>
        }
        subtitle="Manage assignments, track status in real-time, and supervise project delivery velocity."
      >
        <LinkButton href="/admin/members/new" variant="secondary" size="md">
          + Add Member
        </LinkButton>
        <LinkButton href="/admin/tasks/new" variant="primary" size="md">
          + Create Task
        </LinkButton>
      </PageHeader>

      {/* 6 Top Metric Cards (Image 4) */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {/* 1. Team Members */}
        <StatCard
          label="Team Members"
          value={data.members_count}
          href="/admin/members"
          accentColor="indigo"
          badge={
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              100% active
            </span>
          }
          subtitle={memberNamesPreview}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          }
        />

        {/* 2. All Tasks */}
        <StatCard
          label="All Tasks"
          value={data.tasks_total}
          href="/admin/tasks"
          accentColor="blue"
          progressPercent={data.tasks_total > 0 ? (done / data.tasks_total) * 100 : 0}
          subtitle="Sprint backlog"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />

        {/* 3. To Do */}
        <StatCard
          label="To Do"
          value={todo}
          href="/admin/tasks?status=todo"
          accentColor="amber"
          badge={
            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              {data.tasks_total > 0 ? Math.round((todo / data.tasks_total) * 100) : 0}% load
            </span>
          }
          subtitle="Pending kickoff"
          icon={<span className="h-2.5 w-2.5 rounded-full bg-amber-400" />}
        />

        {/* 4. In Progress */}
        <StatCard
          label="In Progress"
          value={in_progress}
          href="/admin/tasks?status=in_progress"
          accentColor="blue"
          badge={
            <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-700 dark:bg-sky-950/40 dark:text-sky-300">
              Active work
            </span>
          }
          subtitle={in_progress > 0 ? 'Assigned in flight' : 'No active work'}
          icon={<span className="h-2.5 w-2.5 rounded-full bg-blue-500" />}
        />

        {/* 5. Done */}
        <StatCard
          label="Done"
          value={done}
          href="/admin/tasks?status=done"
          accentColor="emerald"
          badge={
            <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {data.tasks_total > 0 ? Math.round((done / data.tasks_total) * 100) : 0}% finished
            </span>
          }
          subtitle="Verified complete"
          icon={
            <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        {/* 6. On-Time Health */}
        <StatCard
          label="On-Time Health"
          value={overdueCount === 0 ? '100%' : `${Math.max(0, 100 - overdueCount * 20)}%`}
          accentColor={overdueCount === 0 ? 'emerald' : 'rose'}
          badge={
            <span
              className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                overdueCount === 0
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              {overdueCount} Overdue
            </span>
          }
          subtitle={overdueCount === 0 ? 'Schedules compliant' : 'Attention required'}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          }
        />
      </div>

      {/* Main Two-Column Layout (Image 4) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Active Tasks Registry (Image 4) */}
        <section className="lg:col-span-8 space-y-4">
          <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
            {/* Section Header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                  Active Tasks Registry
                </h2>
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {tasks.meta.total} Total
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing {tasks.data.length} of {tasks.meta.total} sprint records
              </span>
            </div>

            {/* Task Filters */}
            <TaskFilters
              status={status}
              assignedTo={assignedTo}
              members={members}
              totalTasksCount={tasks.meta.total}
            />

            {/* Tasks Table */}
            {tasks.data.length === 0 ? (
              hasFilters ? (
                <EmptyState
                  title="No tasks match these filters"
                  text="Try clearing or adjusting filters."
                >
                  <LinkButton href="/admin" variant="secondary" size="sm">
                    Clear filters
                  </LinkButton>
                </EmptyState>
              ) : (
                <EmptyState
                  title="No tasks yet in this sprint"
                  text="Get started by delegating assignments to team members."
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
                          aria-label="Select all tasks (UI feature)"
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
                          {/* Checkbox (Image 4) */}
                          <td className="px-3 py-3.5 text-center">
                            <input
                              type="checkbox"
                              defaultChecked={isDone}
                              aria-label={`Select task ${task.title}`}
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                            />
                          </td>

                          {/* Task Details */}
                          <td className="px-3.5 py-3.5 max-w-xs">
                            <div className="min-w-0">
                              <p
                                className={`font-semibold text-xs transition-colors ${
                                  isDone
                                    ? 'text-slate-400 line-through dark:text-slate-500'
                                    : 'text-slate-900 dark:text-white hover:text-blue-600'
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

                          {/* Assigned Member (Image 4 with Avatar) */}
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

                          {/* Current Status Pill Selector */}
                          <td className="px-3.5 py-3.5 whitespace-nowrap">
                            <StatusSelect
                              taskId={task.id}
                              status={task.status}
                              label={`Status of ${task.title}`}
                            />
                          </td>

                          {/* Due Date with Calendar Icon */}
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

                          {/* Actions: Edit & Delete */}
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

            {/* Pagination Controls */}
            <Pagination
              currentPage={tasks.meta.current_page}
              lastPage={tasks.meta.last_page}
              hrefFor={hrefFor}
            />
          </div>
        </section>

        {/* Right Column: Workload, Sprint Distribution & Audit Logs (Image 4) */}
        <div className="lg:col-span-4">
          <AdminSidebar members={members} dashboard={data} />
        </div>
      </div>
    </div>
  );
}
