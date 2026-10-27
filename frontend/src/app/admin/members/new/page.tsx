import type { Metadata } from 'next';
import { createMemberAction } from '@/actions/members';
import { PageHeader } from '@/components/layout/PageHeader';
import { MemberForm } from '@/components/members/MemberForm';

export const metadata: Metadata = { title: 'Add member | Task Management' };

export default function NewMemberPage() {
  return (
    <div className="max-w-md">
      <PageHeader title="Add member" />
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <MemberForm action={createMemberAction} submitLabel="Add member" />
      </div>
      <p className="mt-3 text-sm text-gray-600">
        You choose the password. Tell the member, so they can sign in.
      </p>
    </div>
  );
}
