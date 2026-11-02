import type { Metadata } from 'next';
import { MemberSidebar } from '@/components/layout/MemberSidebar';
import { StatusTabs } from '@/components/tasks/StatusTabs';
import { TaskCard } from '@/components/tasks/TaskCard';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { Pagination } from '@/components/ui/Pagination';
import { getCurrentUser } from '@/lib/auth';
import { listTasks } from '@/lib/services';
import { isOverdue, isTaskStatus } from '@/lib/task-status';
import type { Task } from '@/lib/types';

export const metadata: Metadata = { title: 'My Workspace | TaskStream' };

type Props = { searchParams: Promise<{ page?: string; status?: string }> };

export default async function MemberHomePage({ searchParams }: Props) {
  const params = await searchParams;
  const user = await getCurrentUser();

  const currentPage = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
  const statusParam = params.status;
  const isOverdueTab = statusParam === 'overdue';
  const status = isTaskStatus(statusParam) ? statusParam : undefined;

  // Fetch page tasks and all tasks to compute accurate metrics & sidebars
  const [tasksResponse, allTasksResponse] = await Promise.all([
    listTasks({ page: currentPage, status: isOverdueTab ? undefined : status }),
    listTasks({ page: 1 }), // sample for workspace metrics
  ]);

  let displayTasks: Task[] = tasksResponse.data;

  // Filter if overdue tab selected
  if (isOverdueTab) {
    displayTasks = tasksResponse.data.filter((t) => isOverdue(t));
  }

  // Calculate metrics across tasks
  const allTasks = allTasksResponse.data;
  const totalCount = allTasksResponse.meta.total;
  const doneCount = allTasks.filter((t) => t.status === 'done').length;
  const inProgressCount = allTasks.filter((t) => t.status === 'in_progress').length;
  const todoCount = allTasks.filter((t) => t.status === 'todo').length;
  const overdueTasks = allTasks.filter((t) => isOverdue(t));

  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  // Next upcoming deadline task (not done, has due date)
  const upcomingTask = allTasks
    .filter((t) => t.status !== 'done' && t.due_date)
    .sort((a, b) => (a.due_date! > b.due_date! ? 1 : -1))[0];

  const firstOverdueTask = overdueTasks[0];

  const hrefFor = (page: number) => {
    const query = new URLSearchParams({ page: String(page) });
    if (statusParam) query.set('status', statusParam);
    return `/member?${query}`;
  };

  const memberFirstName = user?.name ? user.name.split(' ')[0] : 'Member';

  return (
    <div className="w-full space-y-6">
      {/* 1. Overdue Alert Banner (Image 5 - Spanning full width) */}
      {firstOverdueTask && (
        <AlertBanner
          title="Attention: 1 Overdue Task Requires Action"
          message={`"${firstOverdueTask.title}" was due on ${firstOverdueTask.due_date}. Please update progress or mark it complete.`}
          actionHref={`/member/tasks/${firstOverdueTask.id}`}
          actionLabel="Resolve Task"
          variant="danger"
        />
      )}

      {/* 2. Main Workspace Grid (Image 5) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column (Primary Tasks Workspace) */}
        <section className="space-y-6 lg:col-span-8">
          {/* Top 2 Status Cards (Workspace Status & Overall Progress - Image 5) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Workspace Status Card */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Workspace Status
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>

              <h1 className="mt-3 text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {memberFirstName} 👋
              </h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Here is your daily assigned work breakdown and deadlines.
              </p>

              <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
                Managed by:{' '}
                <strong className="text-slate-700 dark:text-slate-300">
                  Alice & Brian (Admins)
                </strong>
              </div>
            </div>

            {/* Overall Progress Card */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Overall Progress
                </span>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {progressPercent}% Complete
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {doneCount}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  of {totalCount} assigned tasks completed
                </span>
              </div>

              {/* Multi-step progress bar */}
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-300"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>{doneCount} Done</span>
                <span>{inProgressCount} In Progress</span>
                <span>{todoCount} To Do</span>
              </div>
            </div>
          </div>

          {/* Status filter tabs (Image 5) */}
          <StatusTabs
            basePath="/member"
            current={isOverdueTab ? 'overdue' : status}
            counts={{
              all: totalCount,
              todo: todoCount,
              in_progress: inProgressCount,
              done: doneCount,
              overdue: overdueTasks.length,
            }}
          />

          {/* Tasks Cards List */}
          {displayTasks.length === 0 ? (
            status || isOverdueTab ? (
              <EmptyState
                title="No tasks match this filter"
                text="Try selecting another status tab."
              >
                <LinkButton href="/member" variant="secondary" size="sm">
                  Show all tasks
                </LinkButton>
              </EmptyState>
            ) : (
              <EmptyState
                title="No tasks assigned yet"
                text="When your supervisor assigns sprint tasks to you, they will appear here in real-time."
              />
            )
          ) : (
            <ul className="space-y-4">
              {displayTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </ul>
          )}

          <Pagination
            currentPage={tasksResponse.meta.current_page}
            lastPage={tasksResponse.meta.last_page}
            hrefFor={hrefFor}
          />
        </section>

        {/* Right Column: Next Deadline, Focus, Supervisors, Productivity Streak (Image 5) */}
        <div className="lg:col-span-4">
          <MemberSidebar tasks={allTasks} upcomingTask={upcomingTask} />
        </div>
      </div>
    </div>
  );
}
