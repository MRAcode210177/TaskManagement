import type { Metadata } from 'next';
import { createMemberAction } from '@/actions/members';
import { PageHeader } from '@/components/layout/PageHeader';
import { MemberForm } from '@/components/members/MemberForm';
import { LinkButton } from '@/components/ui/LinkButton';

export const metadata: Metadata = { title: 'Add Member | TaskPilot' };

export default function NewMemberPage() {
  return (
    <div className="max-w-xl">
      <PageHeader
        title="Add Team Collaborator"
        subtitle="Provision a member account to delegate sprint tasks."
      >
        <LinkButton href="/admin/members" variant="secondary" size="sm">
          ← Back to Members
        </LinkButton>
      </PageHeader>

      <MemberForm action={createMemberAction} submitLabel="Add Member" />

      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        You choose the temporary credentials. Share the credentials securely with the member so they
        can sign in.
      </p>
    </div>
  );
}
