import type { Metadata } from 'next';
import { createTaskAction } from '@/actions/tasks';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskForm } from '@/components/tasks/TaskForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { listAllMembers } from '@/lib/services';

export const metadata: Metadata = { title: 'Add task | Task Management' };

export default async function NewTaskPage() {
  const members = await listAllMembers();

  // A task must be given to a member. No members = nobody to give it to.
  if (members.length === 0) {
    return (
      <div className="max-w-lg">
        <PageHeader title="Add task" />
        <EmptyState title="Add a member first" text="A task must be given to a member.">
          <LinkButton href="/admin/members/new">Add member</LinkButton>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Add task" />
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <TaskForm action={createTaskAction} members={members} submitLabel="Add task" />
      </div>
    </div>
  );
}
