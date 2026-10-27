import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeleteMemberButton } from '@/components/members/DeleteMemberButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { Pagination } from '@/components/ui/Pagination';
import { listMembers } from '@/lib/services';

export const metadata: Metadata = { title: 'Members | Task Management' };

// In Next.js 16, searchParams is a Promise.
type Props = { searchParams: Promise<{ page?: string }> };

export default async function MembersPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(page ?? '1', 10) || 1);

  const members = await listMembers(currentPage);

  return (
    <div>
      <PageHeader title="Members">
        <LinkButton href="/admin/members/new">Add member</LinkButton>
      </PageHeader>

      {members.data.length === 0 ? (
        <EmptyState
          title={currentPage > 1 ? 'No members on this page' : 'No members yet'}
          text={
            currentPage > 1
              ? 'Go back to the first page.'
              : 'Add your first member, then give them tasks.'
          }
        >
          {currentPage > 1 ? (
            <LinkButton href="/admin/members" variant="secondary">
              First page
            </LinkButton>
          ) : (
            <LinkButton href="/admin/members/new">Add member</LinkButton>
          )}
        </EmptyState>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <caption className="sr-only">Your members</caption>
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Name
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.data.map((member) => (
                  <tr key={member.id}>
                    <td className="px-4 py-3 font-medium">{member.name}</td>
                    <td className="px-4 py-3 text-gray-600">{member.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <LinkButton href={`/admin/members/${member.id}`} variant="secondary">
                          Edit
                        </LinkButton>
                        <DeleteMemberButton id={member.id} name={member.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={members.meta.current_page}
            lastPage={members.meta.last_page}
            hrefFor={(p) => `/admin/members?page=${p}`}
          />
        </>
      )}
    </div>
  );
}
