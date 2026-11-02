import { logoutAction } from '@/actions/auth';
import { NavLinks, type NavLink } from '@/components/layout/NavLinks';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { User } from '@/lib/types';

type Props = {
  user: User;
  links: NavLink[];
};

export function AppHeader({ user, links }: Props) {
  const isAdmin = user.role === 'admin';
  const showSubNav = links.length > 1;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-colors dark:border-slate-800/90 dark:bg-slate-900/95">
      {/* Keyboard navigation skip link */}
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      {/* Main Top Bar */}
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left Zone: Brand Identity + Search Input */}
        <div className="flex items-center gap-5 sm:gap-6 min-w-0">
          {/* Brand Identity (Image 4 & 5) */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl shadow-xs transition-transform hover:scale-105 ${
                isAdmin
                  ? 'bg-blue-600 text-white shadow-blue-500/25'
                  : 'bg-indigo-600 text-white shadow-indigo-500/25'
              }`}
            >
              {isAdmin ? (
                // TaskPilot Check Icon
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                // TaskStream Layers Icon
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                  {isAdmin ? 'TaskPilot' : 'TaskStream'}
                </span>
                {!isAdmin && (
                  <span className="rounded bg-slate-200/80 px-1.5 py-0.2 text-[10px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Core
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                {isAdmin ? (
                  <span>Admin Workspace</span>
                ) : (
                  <>
                    <span>/ My Workspace</span>
                    <span className="rounded bg-indigo-50 px-1 py-0.2 text-[10px] font-medium text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                      Member View
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar - Positioned adjacent to Brand (Image 4) */}
          <div className="hidden md:flex w-72 lg:w-84 xl:w-96">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                readOnly
                placeholder="Search tasks, members, or filters..."
                aria-label="Quick search (UI preview)"
                className="w-full rounded-xl border border-slate-200/90 bg-slate-50/90 py-1.5 pr-10 pl-9 text-xs text-slate-900 placeholder-slate-400 shadow-2xs transition-all focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:bg-slate-900 cursor-pointer"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-400">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Right Zone: System Utilities | User Account | Logout */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Group 1: Live Status & Quick Utilities */}
          <div className="flex items-center gap-2">
            {/* Sync status indicator (Image 4 & 5) */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/80 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Sync: Live (API 200)</span>
            </div>

            {/* Notification Bell Icon (Image 4 & 5) */}
            <button
              type="button"
              aria-label="Notifications"
              title="Notifications"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-850 dark:hover:text-slate-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Theme Toggle Button */}
            <ThemeToggle />
          </div>

          {/* Vertical Separator */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />

          {/* Group 2: User Profile Capsule */}
          <div className="flex items-center gap-2.5">
            <Avatar name={user.name} id={user.id} size="sm" showStatus status="online" />
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[130px] truncate">
                  {user.name}
                </span>
                <Badge variant={isAdmin ? 'info' : 'secondary'} size="sm" className="capitalize">
                  {user.role}
                </Badge>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[150px] truncate">
                {user.email}
              </span>
            </div>
          </div>

          {/* Vertical Separator */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />

          {/* Group 3: Logout Action */}
          <form action={logoutAction}>
            <button
              type="submit"
              title="Log out"
              aria-label="Log out"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-2xs transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Log out</span>
            </button>
          </form>
        </div>
      </div>

      {/* Sub-navbar with links for Multi-Section Workspaces (Admin View - Image 4) */}
      {showSubNav && (
        <div className="border-t border-slate-200/60 bg-slate-50/50 px-4 py-1.5 dark:border-slate-800/60 dark:bg-slate-900/60 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between">
            <nav aria-label="Main Navigation">
              <NavLinks links={links} />
            </nav>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>Sprint Operations Active</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
