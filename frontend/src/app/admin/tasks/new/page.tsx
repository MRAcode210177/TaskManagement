import type { Metadata } from 'next';
import { createTaskAction } from '@/actions/tasks';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskForm } from '@/components/tasks/TaskForm';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { listAllMembers } from '@/lib/services';

export const metadata: Metadata = { title: 'Create Task | TaskPilot' };

export default async function NewTaskPage() {
  const members = await listAllMembers();

  if (members.length === 0) {
    return (
      <div className="max-w-2xl">
        <PageHeader title="Create New Task" subtitle="Assign sprint work to collaborators." />
        <EmptyState
          title="Add a team member first"
          text="Tasks require an assigned member. Please register at least one collaborator before creating tasks."
        >
          <LinkButton href="/admin/members/new" variant="primary">
            + Add Member
          </LinkButton>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Create New Sprint Task"
        subtitle="Specify deliverables, assignees, and target deadline."
      >
        <LinkButton href="/admin/tasks" variant="secondary" size="sm">
          ← Back to Tasks
        </LinkButton>
      </PageHeader>

      <TaskForm action={createTaskAction} members={members} submitLabel="Create Task" />
    </div>
  );
}
