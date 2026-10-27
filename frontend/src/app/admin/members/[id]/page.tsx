import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { updateMemberAction } from '@/actions/members';
import { PageHeader } from '@/components/layout/PageHeader';
import { MemberForm } from '@/components/members/MemberForm';
import { getMember } from '@/lib/services';

export const metadata: Metadata = { title: 'Edit member | Task Management' };

// In Next.js 16, params is a Promise.
type Props = { params: Promise<{ id: string }> };

export default async function EditMemberPage({ params }: Props) {
  const { id } = await params;
  const memberId = Number(id);
  if (!Number.isInteger(memberId) || memberId < 1) notFound();

  // Laravel gives 404 for another admin's member, so we show "not found" too.
  const member = await getMember(memberId);
  if (!member) notFound();

  return (
    <div className="max-w-md">
      <PageHeader title="Edit member" />
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <MemberForm
          action={updateMemberAction.bind(null, member.id)}
          member={member}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
