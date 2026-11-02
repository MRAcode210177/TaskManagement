import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { updateMemberAction } from '@/actions/members';
import { PageHeader } from '@/components/layout/PageHeader';
import { MemberForm } from '@/components/members/MemberForm';
import { LinkButton } from '@/components/ui/LinkButton';
import { getMember } from '@/lib/services';

export const metadata: Metadata = { title: 'Edit Member | TaskPilot' };

type Props = { params: Promise<{ id: string }> };

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params;
  const memberId = Number(id);
  if (!Number.isInteger(memberId) || memberId < 1) notFound();

  const member = await getMember(memberId);
  if (!member) notFound();

  return (
    <div className="max-w-xl">
      <PageHeader
        title={`Edit ${member.name}`}
        subtitle="Update member contact details or reset access password."
      >
        <LinkButton href="/admin/members" variant="secondary" size="sm">
          ← Back to Members
        </LinkButton>
      </PageHeader>

      <MemberForm
        action={updateMemberAction.bind(null, member.id)}
        member={member}
        submitLabel="Save Changes"
      />
    </div>
  );
}
