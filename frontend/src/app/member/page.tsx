import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatusTabs } from '@/components/tasks/StatusTabs';
import { TaskCard } from '@/components/tasks/TaskCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { Pagination } from '@/components/ui/Pagination';
import { listTasks } from '@/lib/services';
import { isTaskStatus } from '@/lib/task-status';

export const metadata: Metadata = { title: 'My tasks | Task Management' };

// In Next.js 16, searchParams is a Promise.
type Props = { searchParams: Promise<{ page?: string; status?: string }> };

export default async function MemberHomePage({ searchParams }: Props) {
  const params = await searchParams;

  // Read the address carefully. A wrong value is ignored.
  const currentPage = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
  const status = isTaskStatus(params.status) ? params.status : undefined;

  // The same call as the admin list. Laravel returns ONLY this member's tasks.
  const tasks = await listTasks({ page: currentPage, status });

  const hrefFor = (page: number) => {
    const query = new URLSearchParams({ page: String(page) });
    if (status) query.set('status', status);
    return `/member?${query}`;
  };

  return (
    <div>
      <PageHeader title="My tasks" />

      <StatusTabs basePath="/member" current={status} />

      {tasks.data.length === 0 ? (
        status ? (
          <EmptyState title="No tasks with this status" text="Try another tab.">
            <LinkButton href="/member" variant="secondary">
              Show all tasks
            </LinkButton>
          </EmptyState>
        ) : (
          <EmptyState
            title="No tasks yet"
            text="When your admin gives you a task, you will see it here."
          />
        )
      ) : (
        <>
          <ul className="space-y-3">
            {tasks.data.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </ul>

          <Pagination
            currentPage={tasks.meta.current_page}
            lastPage={tasks.meta.last_page}
            hrefFor={hrefFor}
          />
        </>
      )}
    </div>
  );
}
