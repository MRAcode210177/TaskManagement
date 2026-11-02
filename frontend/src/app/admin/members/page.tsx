import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { DeleteMemberButton } from '@/components/members/DeleteMemberButton';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LinkButton } from '@/components/ui/LinkButton';
import { Pagination } from '@/components/ui/Pagination';
import { listMembers } from '@/lib/services';

export const metadata: Metadata = { title: 'Team Collaborators | TaskPilot' };

type Props = { searchParams: Promise<{ page?: string }> };

export default async function MembersPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(page ?? '1', 10) || 1);

  const members = await listMembers(currentPage);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team Collaborators & Members"
        badge={
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            {members.meta.total} Active
          </span>
        }
        subtitle="Manage workspace permissions, team access credentials, and task distribution."
      >
        <LinkButton href="/admin/members/new" variant="primary" size="md">
          + Add Member
        </LinkButton>
      </PageHeader>

      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/90 dark:bg-slate-900/80">
        {members.data.length === 0 ? (
          <EmptyState
            title={currentPage > 1 ? 'No members on this page' : 'No team members registered yet'}
            text={
              currentPage > 1
                ? 'Navigate back to the initial page.'
                : 'Invite or create your first team collaborator to assign tasks.'
            }
          >
            {currentPage > 1 ? (
              <LinkButton href="/admin/members" variant="secondary">
                First page
              </LinkButton>
            ) : (
              <LinkButton href="/admin/members/new" variant="primary">
                + Add Member
              </LinkButton>
            )}
          </EmptyState>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800/80">
              <table className="min-w-full divide-y divide-slate-100 text-left text-xs dark:divide-slate-800">
                <caption className="sr-only">Your members</caption>
                <thead className="bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-950/50 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      COLLABORATOR
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      WORK EMAIL
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      ROLE & STATUS
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800/60 dark:bg-slate-900/60">
                  {members.data.map((member) => (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-850/50"
                    >
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={member.name}
                            id={member.id}
                            size="sm"
                            showStatus
                            status="online"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {member.name}
                            </p>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
                              ID: #{member.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <svg
                            className="h-3.5 w-3.5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{member.email}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" size="sm">
                            Member
                          </Badge>
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <LinkButton
                            href={`/admin/members/${member.id}`}
                            variant="secondary"
                            size="xs"
                          >
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
    </div>
  );
}
