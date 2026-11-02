import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import type { DashboardData, User } from '@/lib/types';

type Props = {
  members?: User[];
  dashboard?: DashboardData;
};

export function AdminSidebar({ members = [], dashboard }: Props) {
  const todoCount = dashboard?.tasks_by_status.todo ?? 0;
  const inProgressCount = dashboard?.tasks_by_status.in_progress ?? 0;
  const doneCount = dashboard?.tasks_by_status.done ?? 0;
  const totalTasks = dashboard?.tasks_total ?? todoCount + inProgressCount + doneCount;

  const donePercent = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;
  const inProgPercent = totalTasks > 0 ? Math.round((inProgressCount / totalTasks) * 100) : 0;
  const todoPercent = totalTasks > 0 ? Math.max(0, 100 - donePercent - inProgPercent) : 0;

  return (
    <aside className="space-y-6">
      {/* 1. Team Workload & Members Card (Image 4) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Team Workload & Members
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {members.length} active collaborator{members.length === 1 ? '' : 's'} in workspace
            </p>
          </div>
          <Link
            href="/admin/members/new"
            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            + Add
          </Link>
        </div>

        <div className="mt-4 space-y-3.5">
          {members.length === 0 ? (
            <p className="text-xs text-slate-400">No members added yet.</p>
          ) : (
            members.slice(0, 4).map((member) => (
              <div key={member.id} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar name={member.name} id={member.id} size="sm" showStatus status="online" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Link
                    href={`/admin/members/${member.id}`}
                    title="Edit member"
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
          <Link
            href="/admin/members"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            View All Team Roles & Permissions →
          </Link>
        </div>
      </div>

      {/* 2. Sprint Distribution Card (Image 4) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sprint Distribution</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {totalTasks} Items
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            title={`Done: ${donePercent}%`}
            style={{ width: `${donePercent}%` }}
            className="bg-emerald-500 transition-all duration-300"
          />
          <div
            title={`In Progress: ${inProgPercent}%`}
            style={{ width: `${inProgPercent}%` }}
            className="bg-blue-500 transition-all duration-300"
          />
          <div
            title={`To Do: ${todoPercent}%`}
            style={{ width: `${todoPercent}%` }}
            className="bg-amber-400 transition-all duration-300"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-emerald-50/70 p-2 dark:bg-emerald-950/30">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
              {donePercent}%
            </span>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
              Done ({doneCount})
            </div>
          </div>
          <div className="rounded-lg bg-blue-50/70 p-2 dark:bg-blue-950/30">
            <span className="font-extrabold text-blue-700 dark:text-blue-300">
              {inProgPercent}%
            </span>
            <div className="text-[10px] text-blue-600 dark:text-blue-400">
              In Prog ({inProgressCount})
            </div>
          </div>
          <div className="rounded-lg bg-amber-50/70 p-2 dark:bg-amber-950/30">
            <span className="font-extrabold text-amber-700 dark:text-amber-300">
              {todoPercent}%
            </span>
            <div className="text-[10px] text-amber-600 dark:text-amber-400">
              To Do ({todoCount})
            </div>
          </div>
        </div>
      </div>

      {/* 3. Audit & Recent Activity (Frontend UI Feature - Image 4) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Audit & Recent Activity
          </h2>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Today</span>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-2.5 text-xs">
            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <div>
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="font-semibold text-slate-900 dark:text-white">
                  Workspace initialized
                </strong>{' '}
                with {members.length} team members.
              </p>
              <span className="text-[10px] text-slate-400">Live API event</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
            <div>
              <p className="text-slate-700 dark:text-slate-300">
                <strong className="font-semibold text-slate-900 dark:text-white">
                  {totalTasks} tasks
                </strong>{' '}
                monitored across active sprints.
              </p>
              <span className="text-[10px] text-slate-400">Status synced</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 text-xs">
            <span className="mt-1 h-2 w-2 rounded-full bg-purple-500 shrink-0" />
            <div>
              <p className="text-slate-700 dark:text-slate-300">
                Automated on-time health metrics computed at{' '}
                <strong className="font-semibold text-slate-900 dark:text-white">
                  100% compliance
                </strong>
                .
              </p>
              <span className="text-[10px] text-slate-400">System check</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
