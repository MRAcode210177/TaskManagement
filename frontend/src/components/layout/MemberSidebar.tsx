import { Avatar } from '@/components/ui/Avatar';
import type { Task } from '@/lib/types';

type Props = {
  tasks?: Task[];
  upcomingTask?: Task;
};

export function MemberSidebar({ tasks = [], upcomingTask }: Props) {
  const completedCount = tasks.filter((t) => t.status === 'done').length;

  const todayStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  return (
    <aside className="space-y-5">
      {/* 1. Next Upcoming Deadline Card (Image 5 - Top of Sidebar) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Next Upcoming Deadline
          </span>
          {upcomingTask?.due_date && (
            <span className="rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
              Due Today
            </span>
          )}
        </div>

        <h2 className="mt-3 text-base font-bold text-slate-900 dark:text-white truncate">
          {upcomingTask ? upcomingTask.title : 'All caught up!'}
        </h2>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Target completion: {upcomingTask?.due_date ?? 'No pending deadlines'}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] dark:border-slate-800">
          <span className="text-slate-400 dark:text-slate-500">Current stage:</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">
            {upcomingTask ? upcomingTask.status.replace('_', ' ') : 'Done'}
          </span>
        </div>
      </div>

      {/* 2. Today's Focus Card (Image 5) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Today&apos;s Focus</h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            {todayStr}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {tasks.length > 0 ? (
            tasks.slice(0, 3).map((task) => {
              const dotColor =
                task.status === 'done'
                  ? 'bg-emerald-500'
                  : task.status === 'in_progress'
                    ? 'bg-amber-500'
                    : 'bg-rose-500';

              return (
                <div key={task.id} className="flex items-start gap-2.5 text-xs">
                  <span className={`mt-1.5 h-2 w-2 rounded-full ${dotColor} shrink-0`} />
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      Target: {task.due_date ? task.due_date : 'Today'} •{' '}
                      {task.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <div className="flex items-start gap-2.5 text-xs">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Review assigned tasks
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Target: ASAP this morning
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Update task progress status
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Target: 3:00 PM</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Assigned Supervisors (Frontend UI Feature - Image 5) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Assigned Supervisors
          </h2>
        </div>

        <div className="mt-4 space-y-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name="Alice Admin" size="sm" showStatus status="online" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  Alice Admin
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  Lead Project Manager
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ping
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name="Brian Admin" size="sm" showStatus status="online" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  Brian Admin
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  Team Coordinator
                </p>
              </div>
            </div>
            <button
              type="button"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ping
            </button>
          </div>
        </div>
      </div>

      {/* 4. Productivity Streak (Frontend UI Feature - Image 5) */}
      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-colors dark:border-slate-800/90 dark:bg-slate-900/80">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Productivity Streak
          </h2>
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            🔥 4 Day Streak
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-850">
            <div className="text-xl font-black text-slate-900 dark:text-white">88%</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">On-time delivery</div>
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-850">
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {completedCount > 0 ? completedCount : 6}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Tasks closed this wk
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400 dark:text-slate-500">
          Need an extension? Reach out to your supervisor before deadline.
        </p>
      </div>
    </aside>
  );
}
