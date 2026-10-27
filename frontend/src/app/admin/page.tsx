import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { StatCard } from '@/components/ui/StateCard';
import { getDashboard } from '@/lib/services';

export const metadata: Metadata = { title: 'Dashboard | Task Management' };

export default async function AdminHomePage() {
  const data = await getDashboard();
  const { todo, in_progress, done } = data.tasks_by_status;

  return (
    <div>
      <PageHeader title="Dashboard" />

      {data.members_count === 0 && (
        <div className="mb-6">
          <EmptyState
            title="Welcome! Start by adding a member"
            text="Members get tasks from you and can update their status."
          >
            <LinkButton href="/admin/members/new">Add your first member</LinkButton>
          </EmptyState>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Members" value={data.members_count} href="/admin/members" />
        <StatCard label="All tasks" value={data.tasks_total} />
        <StatCard label="To do" value={todo} />
        <StatCard label="In progress" value={in_progress} />
        <StatCard label="Done" value={done} />
      </div>
    </div>
  );
}
