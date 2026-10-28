import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeleteTaskButton } from '@/components/tasks/DeleteTaskButton';
import { StatusSelect } from '@/components/tasks/StatusSelect';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { Pagination } from '@/components/ui/Pagination';
import { listAllMembers, listTasks } from '@/lib/services';
import { isTaskStatus } from '@/lib/task-status';

export const metadata: Metadata = { title: 'Tasks | Task Management' };

// In Next.js 16, searchParams is a Promise.
type Props = {
  searchParams: Promise<{ page?: string; status?: string; assigned_to?: string }>;
};

export default async function TasksPage({ searchParams }: Props) {
  const params = await searchParams;

  // Read the address carefully. A wrong value is ignored.
  const currentPage = Math.max(1, Number.parseInt(params.page ?? '1', 10) || 1);
  const status = isTaskStatus(params.status) ? params.status : undefined;
  const assignedTo = Number.parseInt(params.assigned_to ?? '', 10) || undefined;
  const hasFilters = status !== undefined || assignedTo !== undefined;

  // Two requests at the same time.
  const [tasks, members] = await Promise.all([
    listTasks({ page: currentPage, status, assignedTo }),
    listAllMembers(),
  ]);

  // The address of another page. It keeps the filters.
  const hrefFor = (page: number) => {
    const query = new URLSearchParams({ page: String(page) });
    if (status) query.set('status', status);
    if (assignedTo) query.set('assigned_to', String(assignedTo));
    return `/admin/tasks?${query}`;
  };

  return (
    <div>
      <PageHeader title="Tasks">
        <LinkButton href="/admin/tasks/new">Add task</LinkButton>
      </PageHeader>

      <TaskFilters status={status} assignedTo={assignedTo} members={members} />

      {tasks.data.length === 0 ? (
        hasFilters ? (
          <EmptyState title="No tasks match these filters" text="Try other filters.">
            <LinkButton href="/admin/tasks" variant="secondary">
              Clear filters
            </LinkButton>
          </EmptyState>
        ) : (
          <EmptyState title="No tasks yet" text="Add a task and give it to one of your members.">
            <LinkButton href="/admin/tasks/new">Add task</LinkButton>
          </EmptyState>
        )
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <caption className="sr-only">Your tasks</caption>
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Title
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Member
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Due
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.data.map((task) => (
                  <tr key={task.id}>
                    <td className="px-4 py-3 font-medium">{task.title}</td>
                    <td className="px-4 py-3 text-gray-600">{task.assignee?.name ?? '-'}</td>
                    <td className="px-4 py-3">
                      <StatusSelect
                        taskId={task.id}
                        status={task.status}
                        label={`Status of ${task.title}`}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                      {task.due_date ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <LinkButton href={`/admin/tasks/${task.id}`} variant="secondary">
                          Edit
                        </LinkButton>
                        <DeleteTaskButton id={task.id} title={task.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
