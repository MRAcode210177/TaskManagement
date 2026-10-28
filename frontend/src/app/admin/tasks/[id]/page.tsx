import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { updateTaskAction } from '@/actions/tasks';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskForm } from '@/components/tasks/TaskForm';
import { getTask, listAllMembers } from '@/lib/services';

export const metadata: Metadata = { title: 'Edit task | Task Management' };

// In Next.js 16, params is a Promise.
type Props = { params: Promise<{ id: string }> };

export default async function EditTaskPage({ params }: Props) {
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId) || taskId < 1) notFound();

  const [task, members] = await Promise.all([getTask(taskId), listAllMembers()]);

  // Laravel gives 404 for another admin's task, so we show "not found" too.
  if (!task) notFound();

  return (
    <div className="max-w-lg">
      <PageHeader title="Edit task" />
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <TaskForm
          action={updateTaskAction.bind(null, task.id)}
          members={members}
          task={task}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
