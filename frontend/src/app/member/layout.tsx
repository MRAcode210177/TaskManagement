import { AppHeader } from '@/components/layout/AppHeader';
import type { NavLink } from '@/components/layout/NavLinks';
import { requireRole } from '@/lib/auth';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('member');

  const links: NavLink[] = [
    {
      href: '/member',
      label: 'My Tasks',
      exact: true,
      icon: (
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <AppHeader user={user} links={links} />

      <main id="main-content" className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Member Bottom Node Status Line (Image 5) */}
      <footer className="border-t border-slate-200/80 bg-white/70 py-3 text-[11px] text-slate-500 backdrop-blur-xs dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected to TaskStream Live Member Node</span>
          </div>

          <div className="flex items-center gap-3 text-slate-400 dark:text-slate-500">
            <span>Role: Member</span>
            <span>•</span>
            <span>
              Signed in as <strong>{user.name}</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
