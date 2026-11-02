import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { updateTaskAction } from '@/actions/tasks';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskForm } from '@/components/tasks/TaskForm';
import { LinkButton } from '@/components/ui/LinkButton';
import { getTask, listAllMembers } from '@/lib/services';

export const metadata: Metadata = { title: 'Edit Task | TaskPilot' };

type Props = { params: Promise<{ id: string }> };

export default async function EditTaskPage({ params }: Props) {
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId) || taskId < 1) notFound();

  const [task, members] = await Promise.all([getTask(taskId), listAllMembers()]);

  if (!task) notFound();

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={`Edit: ${task.title}`}
        subtitle="Update task specifications, assignee, or target completion date."
      >
        <LinkButton href="/admin/tasks" variant="secondary" size="sm">
          ← Back to Tasks
        </LinkButton>
      </PageHeader>

      <TaskForm
        action={updateTaskAction.bind(null, task.id)}
        members={members}
        task={task}
        submitLabel="Save Changes"
      />
    </div>
  );
}
